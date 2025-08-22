export default function Devcard({image,name,role,description,instagram,linkedin,github}) {
    return(
        <div className="card h-100 text-center shadow-sm">
            <img
                src={image}
                alt={name}
                className="rounded-circle mx-auto mt-3"
                style={{width: "200px", height: "200px", objectFit: "cover"}}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{name}</h5>
                <p className="text-muted">{role}</p>
                <p className="card-text text-justify">{description}</p>
            </div>
            <div className="card-footer bg-white">
                <div className="d-flex justify content-center gap-3">
                    {instagram && (
                        <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-dark">
                            <i className="bi bi-instagram"></i>
                        </a>
                    )}
                    {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-primary fs-5">
                        <i className="bi bi-linkedin"></i>
                        </a>
                    )}
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer" className="text-dark fs-5">
                        <i className="bi bi-github"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}