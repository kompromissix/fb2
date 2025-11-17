import "./App.scss";

function body(){
    return (
        <div>
            <button type="button">Новая глава</button>
            <input type="text" placeholder="Заголовок"/>
            <input type="text" id="name_file" placeholder="Навзание файла"/>
            <input type="text" id="cle"/>
            <button type="button" onClick={handleClick}>Скачать файл</button>
        </div>
    );
}

export default function App() {
    const handleClick = () => {
        // Создаём содержимое файла
        const text = document.getElementById('text').value;
        const name_book = document.getElementById('name_book').value;
        const chapter = document.getElementById('chapter').value;
        const content = `<?xml version="1.0" encoding="UTF-8"?>
            <FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
              <description>
                <title-info>
                  <genre>fantasy</genre>
                  <author>  
                    <first-name>Джон</first-name>
                    <last-name>Толкин</last-name>
                  </author>
                  <book-title>${name_book}</book-title>
                  <coverpage>
                    <image l:href="#cover.jpg"/>
                  </coverpage>
                  <annotation>
                    <p>sq</p>
                  </annotation>
                </title-info>
              </description>

              <binary id="cover.jpg" content-type="image/jpeg">
                <!-- Здесь будет base64 encoded изображение -->
              </binary>

              <body>
                <image l:href="#cover.jpg"/>
                <title>
                  <p>${chapter}</p>
                </title>
                <p>${text}</p>
              </body>
            </FictionBook>`;
        // Создаём Blob
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Создаём URL для Blob
        const url = URL.createObjectURL(blob);
        
        // Создаём временную ссылку
        const a = document.createElement('a');
        a.href = url;
        const namef = document.getElementById('name_file').value;
        a.download = namef + ".fb2"; // Имя файла
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
            <input type="text" placeholder="Заголовок"/>
            <input type="text" id="name_file" placeholder="Навзание файла"/>
            <input type="text" id="chapter" placeholder="Глава"/>
            <input type="text" id="text" placeholder="Тест"/>
            <input type="text" id="name_book" placeholder="Названия книги"/>
            <button type="button" onClick={handleClick}>Скачать файл</button>
        </div>
    );
}