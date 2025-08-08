import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CourseEdit.css'

// supabase helper to upload files --> we upload files form here take url and send hehe
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);
// handles upload and taking url of the file after upload

const isValidURL = (str) => {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
};

async function updatedLessonsFile(file, lessonTitle) {
    const { data, error } = await supabase
        .storage
        .from('lesson-files')
        .upload(`lessons/${Date.now()}_${lessonTitle}_${file.name}`, file)

    if (error) throw error;

    const { data: publicUrlData } = supabase
        .storage
        .from('lesson-files')
        .getPublicUrl(data.path)

    return publicUrlData.publicUrl
}

const API_URL = `${process.env.REACT_APP_API_URL}/api/courses/`;

const emptyLesson = {
    title: '',
    content_type: 'video',
    content_file: null,
    video_url: '',
    text_content: '',
    order: 1,
};

export default function CreateEditCourse({ courseId = null }) {
    const [uploadingLessonIndex, setUploadingLessonIndex] = useState(null);
    // const lessonListRef = useRef();
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: 0,
        is_published: false,
        categories: [],
        cover_image: null,
    });

    const [lessons, setLessons] = useState([]);
    const [categories, setCategories] = useState([
        { "id": 3, "name": "Artificial Intelligence" },
        { "id": 8, "name": "Blockchain" },
        { "id": 6, "name": "Cloud Computing" },
        { "id": 7, "name": "Cybersecurity" },
        { "id": 2, "name": "Data Science" },
        { "id": 10, "name": "Game Development" },
        { "id": 4, "name": "Machine Learning" },
        { "id": 5, "name": "Mobile App Development" },
        { "id": 9, "name": "UI/UX Design" },
        { "id": 1, "name": "Web Development" }
    ]);

    // For edit flow
    useEffect(() => {
        if (courseId) {
            axios.get(`${API_URL}private/${courseId}/`).then((res) => {
                setCourseData({
                    ...res.data,
                    cover_image: null,
                });
                setLessons((res.data.lessons || []).sort((a, b) => a.order - b.order));
            });
        }
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'is_published') {
            setCourseData((prev) => ({ ...prev, is_published: checked }));
        } else if (type === 'file' && name === 'cover_image') {
            setCourseData((prev) => ({ ...prev, cover_image: e.target.files[0] }));
        } else {
            setCourseData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleLessonChange = async (index, event) => {
        const { name, value, files, type } = event.target;
        const updatedLessons = [...lessons];
        const lesson = { ...updatedLessons[index] };

        // uploads file
        if (name === "content_file" && files?.[0]) {
            if (files[0].size > 25 * 1024 * 1024) { // 25MB
                toast.error("File too large!");
                return;
            }
            try {
                setUploadingLessonIndex(index); // Spinner ON
                const uploadedUrl = await updatedLessonsFile(files[0], lesson.title);
                lesson.content_file = uploadedUrl;
                lesson.video_url = "" // Clear video_url when file is chosen
            } catch (error) {
                toast.error("Failed to upload file to Supabase!");
                return;
            } finally {
                setUploadingLessonIndex(null); // Spinner OFF
            }
        } else if (name === "video_url") {
            lesson.video_url = value;
            lesson.content_file = null; // clear file if URL entered
        } else {
            lesson[name] = type === "checkbox" ? event.target.checked : value;
        }

        updatedLessons[index] = lesson;
        setLessons(updatedLessons);
    };

    // When sending to backend:
    // If content_file exists → prioritize that.
    // If video_url exists → send that instead.
    // If content_type === "text" → send text_content.
    // You might want to handle this logic in handleSubmit() like:
    //     // Example within your form submission:
    //     lessonData.content = lesson.content_file || lesson.video_url || lesson.text_content

    const addLesson = () => {
        setLessons((prev) => [...prev,
        { ...emptyLesson, order: lessons.length + 1 }]);
    };

    const removeLesson = (index) => {
        const newLessons = [...lessons];
        newLessons.splice(index, 1);
        setLessons(newLessons.map((l, i) => ({ ...l, order: i + 1 })));
    };

    const handleCategorySelect = (catId) => {
        setCourseData((prev) => {
            const selected = new Set(prev.categories);
            selected.has(catId) ? selected.delete(catId) : selected.add(catId);
            return { ...prev, categories: Array.from(selected) };
        });
    };

    const handleSubmit = async (e) => {
        // on chatgpt i realised parseing formdata wont let us do things like lesson[0][title] etc to the django react framework soooooo sending data in json and files in formData hehe.
        e.preventDefault();

        if (lessons.length === 0 && courseData.is_published) {
            toast.error("You can't publish a course without lessons!");
            return;
        }

        const formData = new FormData();
        formData.append("title", String(courseData.title));
        formData.append("description", String(courseData.description));
        formData.append("price", Number(courseData.price));
        formData.append("is_published", courseData.is_published);

        Object.entries(courseData).forEach(([key, value]) => {
            if (key === 'categories') {
                value.forEach((catId) => formData.append('categories', catId));
            } else if (value !== null) {
                formData.append(key, value);
            }
        });

        const updatedLessons = lessons.map((lesson, i) => {
            const copied = { ...lesson };

            if (copied.content_file) {
                formData.append(`file_${i}`, copied.content_file);
                copied.content_file = `file_${i}`;
            }
            if (copied.video_url && !isValidURL(copied.video_url)) {
                toast.error(`Invalid video URL in lesson ${i + 1}`);
                throw new Error(`Invalid video URL: ${copied.video_url}`);
            }
            return copied;
        });

        formData.append("lessons", JSON.stringify(updatedLessons));

        try {
            if (courseId) {
                await axios.put(`${API_URL}private/${courseId}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                alert('Course updated!');
            } else {
                // await axios.post(`${API_URL}private/`, formData, {
                await axios.post(`${API_URL}create/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                alert('Course created!');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong!');
        }
    };

    const clearLessonMedia = (index) => {
        const updatedLessons = [...lessons];
        updatedLessons[index].video_url = "";
        updatedLessons[index].content_file = null;
        setLessons(updatedLessons);
    };

    return (
        <div className="container">
            <h2 className="heading-2">{courseId ? 'Edit' : 'Create'} Course</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Title</label>
                <input name="title"
                    value={courseData.title}
                    onChange={handleChange} placeholder="Title" className="input" required />

                <label>Description</label>
                <textarea name="description"
                    value={courseData.description}
                    onChange={handleChange} placeholder="Description" className="textarea" required></textarea>

                <label>Price</label>
                <input type="number" name="price"
                    value={courseData.price}
                    onChange={handleChange} className="input" placeholder="Price"
                    min={0}
                    max={9999} />
                {courseData.price < 0 || courseData.price > 9999 ? (
                    <p className="warning">Price must be between ₹0 and ₹9999.</p>
                ) : null}

                <input type="file" name="cover_image" onChange={handleChange} className="file-input" />
                <label className="checkbox-label">
                    <input type="checkbox" name="is_published"
                        checked={courseData.is_published}
                        onChange={handleChange}
                        // doesnt let publish evne with lesson == 1 but emptty fields
                        disabled={lessons.length === 0 || lessons.some(lesson => !lesson.title || (!lesson.video_url && !lesson.content_file && !lesson.text_content))}
                    /> Published
                </label>

                <div className="category-group">
                    <p className="label-bold">Categories:</p>
                    {categories.map((cat) => (
                        <label key={cat.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={courseData.categories?.includes(cat.id) || false}
                                onChange={() => handleCategorySelect(cat.id)}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>

                <div className="lesson-section">
                    <h3 className="heading-3">Lessons</h3>
                    {lessons.map((lesson, index) => (
                        <div key={index} className="lesson-box">
                            <label>Lesson Title</label>
                            <input
                                name="title"
                                value={lesson.title}
                                onChange={(e) => handleLessonChange(index, e)}
                                placeholder="Lesson Title"
                                className="input"
                            />

                            <label>Content Type</label>
                            <select
                                name="content_type"
                                value={lesson.content_type}
                                onChange={(e) => handleLessonChange(index, e)}
                                className="input"
                            >
                                <option value="">-- Select Type --</option>
                                <option value="video">Video</option>
                                <option value="pdf">PDF</option>
                                <option value="text">Text</option>
                            </select>

                            {/* Conditional rendering based on type */}
                            {lesson.content_type === "video" || lesson.content_type === "pdf" ? (
                                <>
                                    {uploadingLessonIndex === index ? (
                                        <>
                                            <div>Uploading file... ⏳</div></>
                                    ) : (
                                        <>
                                            <label>Upload File</label>
                                            <input
                                                type="file"
                                                name="content_file"
                                                onChange={(e) => handleLessonChange(index, e)}
                                                className="file-input"
                                                disabled={!!lesson.video_url}
                                            />

                                            <label>Or Enter URL</label>
                                            <input
                                                name="video_url"
                                                value={lesson.video_url}
                                                onChange={(e) => handleLessonChange(index, e)}
                                                placeholder="Video or PDF URL"
                                                className="input"
                                                disabled={!!lesson.content_file} />
                                            <button onClick={() => clearLessonMedia(index)}>Clear?</button>
                                        </>
                                    )}
                                </>
                            ) : null}

                            {lesson.content_type === "text" ? (
                                <>
                                    <label>Text Content</label>
                                    <textarea
                                        name="text_content"
                                        value={lesson.text_content || ""}
                                        onChange={(e) => handleLessonChange(index, e)}
                                        className="textarea"
                                        placeholder="Enter lesson text here (markdown supported)"
                                    ></textarea>
                                </>
                            ) : null}

                            <button
                                type="button"
                                className="btn-danger"
                                onClick={() => removeLesson(index)}
                            >
                                Remove Lesson
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn-outline" onClick={addLesson}>
                        + Add Lesson
                    </button>
                </div>

                <button type="submit" className="btn-primary">
                    {courseId ? 'Update' : 'Create'} Course
                </button>
            </form>
        </div>
    );
}
