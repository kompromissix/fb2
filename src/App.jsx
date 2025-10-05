import "./App.scss";

export default function App() {
    const handleClick = () => {
        // Создаём содержимое файла
        const content = "Hello, World!";
        
        // Создаём Blob
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Создаём URL для Blob
        const url = URL.createObjectURL(blob);
        
        // Создаём временную ссылку
        const a = document.createElement('a');
        a.href = url;
        a.download = '123.fb2'; // Имя файла
        document.body.appendChild(a);
        a.click();
        
        // Убираем ссылку после скачивания
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <div>
            <button type="button">Новая глава</button>
            <button type="button">Заголовок</button>
            <input type="text" />
            <button type="button" onClick={handleClick}>Скачать файл</button>
        </div>
    );
}