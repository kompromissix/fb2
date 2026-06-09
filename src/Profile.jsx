import { useEffect, useState } from "react"
import './Profile.scss'


export default function Profile(){
    const [user, setUser] = useState(null)
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');
            
            const res = await fetch('/api/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
          
            const data = await res.json();
            setProjects(data);
        };
      
        fetchProjects();
    }, []);
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    if (!user) return <p>Не авторизован</p>
    const loadProject = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const project = await res.json();
        const data = project.data;
        setProjectId(project.id);
        setTom(data.tom);
        setChapters(data.chapters);
        setTextfb(data.textfb);
        setGenres(data.genres);
        setAnnota(data.annota);
        setImgfb(data.imgfb);
        setImageData(data.imageData);
        setForm(data.form);
    };
    const deleteProject = async (id) => {
        const token = localStorage.getItem('token')

        const confirmDelete = confirm('Удалить проект?')
        if (!confirmDelete) return

        await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setProjects(prev => prev.filter(p => p.id !== id))
    }
    return(
        <>
            <main>
                <section className="background3">
                    <div>
                        <div>
                            <h2>Мои проекты</h2>
                            <div>
                                {projects.map(p => {
                                    const cover = p.data?.imageData;
                                    return(
                                    <div key={p.id}>
                                        <div>
                                            {cover && (
                                                <img src={`data:image/jpeg;base64,${cover}`} alt="cover"/>
                                            )}
                                        </div>
                                        <p>{p.title}</p>
                                        <div>
                                            <button onClick={() => {localStorage.setItem('loadProjectId', p.id); window.location.href = '/'}}>Открыть</button>
                                            <button onClick={() => deleteProject(p.id)}>Удалить</button>
                                        </div>
                                    </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}