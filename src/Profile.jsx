import { useEffect, useState } from "react"

export default function Profile(){
    const [user, setUser] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    if (!user) return <p>Не авторизован</p>
    return(
        <>
            <main>
                <section className="background3">
                    <div>
                        <div>
                            
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}