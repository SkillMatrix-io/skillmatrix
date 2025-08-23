import DevCard from "../components/ui/Devcard";
import "./Devs.css";

export default function Devs(){
    const devs = [
    {
      image: "/profile.jpg",
      name: "Shyamkrishna B Nair",
      role: "Frontend Developer",
      description: "Specializes in building responsive UIs with React and Bootstrap.",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    },
    {
      image: "https://media.licdn.com/dms/image/v2/D5603AQGhwPXE0QTB-Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718650797379?e=1758758400&v=beta&t=BB_gHHgkyTDg6QL27UvZJDREu2V6IkZBRj_TotBpMKY",
      name: "Vineet Kushwaha",
      role: "Fullstack Developer",
      description: "Works with Node.js, Express, and databases to build scalable apps.",
      instagram: "https://instagram.com/vineetwhy",
      linkedin: "https://linkedin.com/in/vineet-k09",
      github: "https://github.com/vineet-k09"
    },
    {
      image: "/profile.jpg",
      name: "Eeksha Holla R",
      role: "Data Scientist",
      description: "Passionate about AI, ML, and deriving insights from data.",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    },
    {
      image: "/profile.jpg",
      name: "Prajwal S",
      role: "UI/UX Designer",
      description: "Designs clean, user-friendly interfaces with modern aesthetics.",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    },
    {
      image: "/profile.jpg",
      name: "Tarun?",
      role: "DevOps Engineer",
      description: "Automates workflows, CI/CD pipelines, and cloud deployments.",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/"
    }
  ];

 return (
  <div className="my-5">
    <div className="row g-4 justify-content-center m-3">
      {devs.map((dev, index) => {
        // alternate up and down offset
        const offset = (index % 2 === 0) ? "-20px" : "20px";  

        return (
          <div 
            className="col-6 col-md-4 col-lg" 
            key={index} 
            style={{ transform: `translateY(${offset})` }}
          >
            <DevCard {...dev} />
          </div>
        );
      })}
    </div>
  </div>
);
}
