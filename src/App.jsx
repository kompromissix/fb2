import "./App.scss";
import { useState } from "react";

export default function App() {
      const [genres, setGenres] = useState(['']);
      const addGenre = () => {
          setGenres([...genres, '']);
      };

      const updateGenre = (index, value) => {
          const newGenres = [...genres];
          newGenres[index] = value;
          setGenres(newGenres);
      };

      const Genrefb2 = () => {
          return genres
              .filter(genre => genre.trim() !== '') // убираем пустые жанры
              .map(genre => `<genre>${genre}</genre>`)
              .join('\n                  ');
      };
    const handleClick = () => {
        // Создаём содержимое файла
        const text = document.getElementById('text').value;
        const name_book = document.getElementById('name_book').value;
        const chapter = document.getElementById('chapter').value;
        const genre = document.getElementById('genre').value;
        const annotation = document.getElementById('annotation').value;
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const content = `<?xml version="1.0" encoding="UTF-8"?>
            <FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
              <description>
                <title-info>
                  ${Genrefb2()}
                  <author>  
                    <first-name>${first_name}</first-name>
                    <last-name>${last_name}</last-name>
                  </author>
                  <book-title>${name_book}</book-title>
                  <coverpage>
                    <image l:href="#cover.jpg"/>
                  </coverpage>
                  <annotation>
                    <p>${annotation}</p>
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
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Создаём URL для Blob
        const url = URL.createObjectURL(blob);
        
        // Создаём временную ссылку
        const a = document.createElement('a');
        a.href = url;
        const name_file = document.getElementById('name_file').value;
        a.download = (name_file || 'book') + ".fb2";
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
            <input type="text" id="name_file" placeholder="Навзание файла"/>
            <input type="text" id="chapter" placeholder="Глава"/>
            <input type="text" id="text" placeholder="Текст"/>
            <input type="text" id="name_book" placeholder="Названия книги"/>
            <div>
                <p>Жанры:</p>
                {genres.map((genre, index) => (
                    <input key={index} type="text" placeholder="Жанр" value={genre} onChange={(e) => updateGenre(index, e.target.value)}
                    />
                ))}
                <button type="button" onClick={addGenre}>+ Добавить жанр</button>
            </div>
            <input type="text" id="annotation" placeholder="Аннотация"/>
            <input type="text" id="first_name" placeholder="Имя"/>
            <input type="text" id="last_name" placeholder="Фамилия"/>
            <button type="button" onClick={handleClick}>Скачать файл</button>
        </div>
    );
}