import "./App.scss";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function App() {
    const [genres, setGenres] = useState(['']);
    const [annota, setAnnota] = useState(['']);
    const [tom, setTom] = useState([{ tom: '' }]);
    const tomSwiperRef = useRef(null);
    const [chapters, setChapters] = useState([
      [{ chapter: '' }]
    ]);
    
    const [textfb, setTextfb] = useState([
      [[{ text: '' }]]
    ]);
    const initialIdfb = Array(chapters.length).fill([]);
    const [idfb, setIdfb] = useState(initialIdfb);
    const [data, setData] = useState('');
    const textareaRefs = useRef([]);
    const [imageData, setImageData] = useState(null);
    const fileInputRef = useRef();
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const paginationRef = useRef(null);

    useEffect(() => {
      const el = paginationRef.current;
      if (!el) return;
    
      const handler = (e) => {
        const btn = e.target.closest('[data-delete]');
        if (!btn) return;
    
        const index = Number(btn.dataset.delete);
        removeTom(index);
      };
  
      el.addEventListener('click', handler);
      return () => el.removeEventListener('click', handler);
    }, [tom.length]);
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        
        reader.onload = (event) => {
            const img = new Image();
            
            img.onload = (e) => {
                const canvas = document.createElement('canvas');
                canvas.width = e.target.naturalWidth;
                canvas.height = e.target.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(e.target, 0, 0);
                const base64Data = canvas.toDataURL('image/jpeg');
                const base64String = base64Data.split(',')[1];
                setImageData(base64String);
            };

            img.onerror = () => {
                alert('Ошибка загрузки изображения');
            };

            img.src = event.target.result;
        };
        
        reader.onerror = () => {
            alert('Ошибка чтения файла');
        };
        
        reader.readAsDataURL(file);
    };

    const handleConvertButtonClick = () => {
        // Если файл уже выбран, конвертируем его
        if (fileInputRef.current.files.length > 0) {
            handleFileChange({ target: fileInputRef.current });
        }
    };

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
            .filter(genre => genre.trim() !== '')
            .map(genre => `<genre>${genre}</genre>`)
            .join('\n                  ');
    };
    const removeGenre = (index) => {
        const newGenre = genres.filter((_, i) => i !== index);
        setGenres(newGenre);
    };

    const addAnno = () => {
        setAnnota([...annota, '']);
    };

    const updateAnno = (annoIndex, value) => {
        const newAnno = [...annota];
        newAnno[annoIndex] = value;
        setAnnota(newAnno);
    };

    const Annofb2 = () => {
        return annota
            .filter(annoItem => annoItem.trim() !== '')
            .map(annoItem => `<p>${annoItem}</p>`)
            .join('\n');
    };
    const removeAnno = (annoIndex) => {
        const newAnno = annota.filter((_, i) => i !== annoIndex);
        setGenres(newAnno);
    };

    const wrapTextWithStrong = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]
        ) return;

        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;  
        const selectedText = textfb[tomIndex][chapterIndex][textIndex]?.text.substring(start, end);

        let newText;
        
        if (selectedText) {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                `<strong>${selectedText}</strong>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<strong></strong>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<strong>${selectedText}</strong>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<strong>'.length;
            }
            textarea.focus();
        }, 0);
    };
    const wrapTextWithEmphasis = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]
        ) return;

        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;  
        const selectedText = textfb[tomIndex][chapterIndex][textIndex]?.text.substring(start, end);

        let newText;
        
        if (selectedText) {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                `<emphasis>${selectedText}</emphasis>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<emphasis></emphasis>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<emphasis>${selectedText}</emphasis>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<emphasis>'.length;
            }
            textarea.focus();
        }, 0);
    };

    const wrapTextWithLink = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]
        ) return;

        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;  
        const selectedText = textfb[tomIndex][chapterIndex][textIndex]?.text.substring(start, end);

        let newText;
        
        if (selectedText) {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                `<a l:href="# и ваш id">${selectedText}</a>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<a l:href="# и ваш id"></a>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<a l:href="# и ваш id">${selectedText}</a>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<a l:href="# и ваш id">'.length;
            }
            textarea.focus();
        }, 0);
    };
    const wrapTextWithSub = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]) return;

        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;  
        const selectedText = textfb[tomIndex][chapterIndex][textIndex]?.text.substring(start, end);

        let newText;
        
        if (selectedText) {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                `<sub>${selectedText}</sub>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<sub></sub>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<sub>${selectedText}</sub>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<sub>'.length;
            }
            textarea.focus();
        }, 0);
    };
    const wrapTextWithSup = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]
        ) return;

        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;  
        const selectedText = textfb[tomIndex][chapterIndex][textIndex]?.text.substring(start, end);

        let newText;
        
        if (selectedText) {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                `<sup>${selectedText}</sup>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<sup></sup>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<sup>${selectedText}</sup>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<sup>'.length;
            }
            textarea.focus();
        }, 0);
    };
    const wrapTextWithStrikethrough = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] || 
            !textareaRefs.current[tomIndex][chapterIndex] || 
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]) return;

        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;  
        const selectedText = textfb[tomIndex][chapterIndex][textIndex]?.text.substring(start, end);

        let newText;
        
        if (selectedText) {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                `<strikethrough>${selectedText}</strikethrough>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<strikethrough></strikethrough>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<strikethrough>${selectedText}</strikethrough>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<strikethrough>'.length;
            }
            textarea.focus();
        }, 0);
    };

    const addChapter = (tomIndex) => {
      setChapters(prev => {
        const copy = [...prev];
        copy[tomIndex] = [...copy[tomIndex], { chapter: '' }];
        return copy;
      });

      setTextfb(prev => {
        const copy = [...prev];
        copy[tomIndex] = [...copy[tomIndex], [{ text: '' }]];
        return copy;
      });
    };
    

    const updateChapter = (tomIndex, chapterIndex, field, value) => {
        setChapters(prev => {
            const copy = [...prev];
            copy[tomIndex] = copy[tomIndex].map((ch, i) =>
                i === chapterIndex ? { ...ch, [field]: value } : ch
            );
            return copy;
        });
    };
    const removeChapter = (tomIndex, chapterIndex) => {
      setChapters(prev => {
        const copy = [...prev];
        copy[tomIndex] = copy[tomIndex].filter((_, i) => i !== chapterIndex);
        return copy;
      });

      setTextfb(prev => {
        const copy = [...prev];
        copy[tomIndex] = copy[tomIndex].filter((_, i) => i !== chapterIndex);
        return copy;
      });
    };

    const Textfb2 = (tomIndex, chapterIndex) => {
      return textfb[tomIndex][chapterIndex]
        ?.filter(t => t.text?.trim())
        ?.map(t => `<p>${t.text}</p>`)
        .join('\n') || '';
    };

    const updateText = (tomIndex, chapterIndex, textIndex, field, value) => {
      setTextfb(prev => {
        const copy = [...prev];
        copy[tomIndex][chapterIndex][textIndex] = {
          ...copy[tomIndex][chapterIndex][textIndex],
          [field]: value,
        };
        return copy;
      });
    };
    const addText = (tomIndex, chapterIndex) => {
      setTextfb(prev => {
        const copy = [...prev];
        copy[tomIndex][chapterIndex] = [
          ...copy[tomIndex][chapterIndex],
          { text: '' }
        ];
        return copy;
      });
    };

    const removeText = (tomIndex, chapterIndex, textIndex) => {
      setTextfb(prev => {
        const copy = [...prev];
        copy[tomIndex][chapterIndex] =
          copy[tomIndex][chapterIndex].filter((_, i) => i !== textIndex);
        return copy;
      });
    };

    const Idfb2 = (chapterIndex) => {
        return idfb[chapterIndex]
            ?.filter(idItem => idItem && (idItem.id?.trim() !== ''))  // Изменил text на id
            ?.map(idItem => `id="${idItem.id || ''}"`)
            ?.join('\n') || '';
    };

    const updateId = (chapterIndex, idIndex, field, value) => {
        const newId = idfb.map((chapterIds, i) => {  // Переименовал chapterTexts на chapterIds для ясности
            if (i === chapterIndex) {
                const updatedIds = chapterIds.map((item, j) => {
                    if (j === idIndex) {
                        return { ...item, [field]: value };
                    }
                    return item;
                });
                return updatedIds;
            }
            return chapterIds;
        });
        setIdfb(newId);
    };

    const addId = (chapterIndex) => {
        const newId = [...idfb];
        if (!newId[chapterIndex]) {
            newId[chapterIndex] = [];
        }
        newId[chapterIndex].push({ id: '' });
        setIdfb(newId);
    };

    const removeId = (chapterIndex, idIndex) => {
        const newId = [...idfb];
        newId[chapterIndex] = newId[chapterIndex].filter((_, i) => i !== idIndex);
        setIdfb(newId);
    };

    const Chapterfb2 = (tomIndex) => {
      return chapters[tomIndex]
        ?.map((chapter, chapterIndex) => `
          <section>
            <title>
              <p>${chapter.chapter || ''}</p>
            </title>
            ${Textfb2(tomIndex, chapterIndex)}
          </section>
        `)
        .join('\n') || '';
    };

    const addTom = () => {
      setTom(prev => [...prev, { tom: '' }]);
      setChapters(prev => [...prev, [{ chapter: '' }]]);
      setTextfb(prev => [...prev, [[{ text: '' }]]]);
    };

    const updateTom = (index, field, value) => {
        const newTom = tom.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setTom(newTom);
    };

    const removeTom = (tomIndex) => {
      setTom(prev => prev.filter((_, i) => i !== tomIndex));
        
      setChapters(prev => prev.filter((_, i) => i !== tomIndex));
        
      setTextfb(prev => prev.filter((_, i) => i !== tomIndex));
        
      setIdfb(prev => prev.filter((_, i) => i !== tomIndex));
        
      textareaRefs.current.splice(tomIndex, 1);
    };

    const Tomfb2 = () => {
      return tom.map((item, tomIndex) => `
        <section>
          <title>
            <p>${item.tom}</p>
          </title>
          ${Chapterfb2(tomIndex)}
        </section>
      `).join('\n');
    };

    const handleClick = () => {
        const name_book = document.getElementById('name_book').value;
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const keywords = document.getElementById('keywords').value;
        const date = document.getElementById('date').value;
        const publisher = document.getElementById('publisher').value;
        const city = document.getElementById('city').value;
        const sequence = document.getElementById('sequence').value;
        const content = `<?xml version="1.0" encoding="UTF-8"?>
            <FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
                <description>
                    <title-info>
                        ${Genrefb2()}
                        <author>  
                            <first-name>${first_name}</first-name>
                            <last-name>${last_name}</last-name>
                        </author>
                        <book-title></book-title>
                        <coverpage>
                            <image l:href="#cover.jpg"/>
                        </coverpage>
                        <annotation>
                            ${Annofb2()}
                        </annotation>
                    </title-info>
                    <keywords>${keywords}</keywords>
                    <date>${date || currentDate}</date>
                </description>
                <publish-info>
                    <book-name>${name_book}</book-name>
                    <publisher>${publisher}</publisher>
                    <city>${city}</city>
                    <sequence>${sequence}</sequence>
                </publish-info>
                <binary id="cover.jpg" content-type="image/jpeg">
                  ${imageData}
                </binary>
                <body>
                    ${Tomfb2()}
                </body>
            </FictionBook>`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const name_file = document.getElementById('name_file').value;
        a.download = (name_file || 'book') + ".fb2";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <main>
            <div>
                <div>
                    <div>
                        <div>
                            <p>Том</p>
                            <div>
                                <div ref={paginationRef} />
                                <button  onClick={() => {const index = tomSwiperRef.current?.activeIndex; addTom(index);}}>+</button>
                            </div>
                        </div>
                        <Swiper modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]} initialSlide={1} onSwiper={(s) => (tomSwiperRef.current = s)} onSlideChange={(swiper) => {tomSwiperRef.current = swiper}} pagination={{el: paginationRef.current, clickable: true, renderBullet: (i, className) => {return `<div class="${className}"> <span>${i + 1}</span> <button data-delete="${i}">✖</button> </div>`;  },}}   onBeforeInit={(swiper) => {  swiper.params.pagination.el = paginationRef.current;}} spaceBetween={50} slidesPerView={1} navigation scrollbar = {{draggable:true}} direction='horizontal' mousewheel = {{clickable:true}}>
                            {tom.map((tomItem, tomIndex) => (
                            <SwiperSlide>
                                <div key={tomIndex} className="tom">
                                    <textarea value={tomItem.tom} onChange={e => updateTom(tomIndex, 'tom', e.target.value)} placeholder="Том"/>
                                    <button onClick={addTom}>Добавить том</button>
                                    <button onClick={() => addChapter(tomIndex)}>Добавить главу</button>
                                    <Swiper modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]} spaceBetween={50} slidesPerView={1} navigation scrollbar = {{draggable:true}} direction='horizontal' pagination = {{clickable:true}} mousewheel = {{clickable:true}}>
                                        {chapters[tomIndex]?.map((chapter, chapterIndex) => (
                                            <SwiperSlide>
                                                <div key={chapterIndex} className="chapter">
                                                    <div>
                                                        <textarea value={chapter.chapter} onChange={e => updateChapter(tomIndex, chapterIndex, 'chapter', e.target.value)} placeholder="Заголовок"/>
                                                    </div>

                                                    <button onClick={() => removeChapter(tomIndex, chapterIndex)}>Удалить главу</button>
                                                    {textfb[tomIndex][chapterIndex]?.map((textItem, textIndex) => (
                                                        <div key={textIndex}>
                                                            <textarea value={textItem.text} ref={el => {if (!textareaRefs.current[tomIndex]) {textareaRefs.current[tomIndex] = []} if (!textareaRefs.current[tomIndex][chapterIndex]) {textareaRefs.current[tomIndex][chapterIndex] = []} textareaRefs.current[tomIndex][chapterIndex][textIndex] = el}} onChange={e => updateText(tomIndex, chapterIndex, textIndex, 'text', e.target.value)} placeholder="Текст" />
                                                            <button onClick={() => removeText(tomIndex, chapterIndex, textIndex)}>Удалить текст</button>
                                                            <button onClick={() => wrapTextWithStrong(tomIndex, chapterIndex, textIndex)}>Strong</button>
                                                            <button onClick={() => wrapTextWithEmphasis(tomIndex, chapterIndex, textIndex)}>Emphasis</button>
                                                            <button onClick={() => wrapTextWithLink(tomIndex, chapterIndex, textIndex)}>Link</button>
                                                            <button onClick={() => wrapTextWithSub(tomIndex, chapterIndex, textIndex)}>Sub</button>
                                                            <button onClick={() => wrapTextWithSup(tomIndex, chapterIndex, textIndex)}>Sup</button>
                                                            <button onClick={() => wrapTextWithStrikethrough(tomIndex, chapterIndex, textIndex)}>Strikethrough</button>
                                                        </div>
                                                    ))}
                                                  <button onClick={() => addText(tomIndex, chapterIndex)}>Добавить текст</button>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                              </SwiperSlide>
                            ))}
                        </Swiper>

                        <input type="file" ref={fileInputRef}onChange={handleFileChange}accept="image/*"/>
                        <button type="button" onClick={handleConvertButtonClick}>Преобразовать в Base64</button>
                        <div>
                            <textarea  value={imageData} readOnly />
                        </div>
                    </div>
                    {/* <p>Жанры:</p>
                    {genres.map((genre, index) => (
                        <div key={index}>
                            <input type="text" placeholder="Жанр" value={genre} onChange={(e) => updateGenre(index, e.target.value)}/>
                            <button onClick={() => removeGenre(index)}>Удалить жанр</button>
                        </div>
                    ))}
                    <button type="button" onClick={addGenre}>+ Добавить жанр</button> */}
                    <div>
                        {annota.map((annoItem, annoIndex) => (
                            <div key={annoIndex}>
                                <p>Аннотация</p>
                                <div>
                                    <textarea value={annoItem} onChange={(e) => updateAnno(annoIndex, e.target.value)} placeholder="Аннотация"/>
                                </div>
                            </div>
                        ))}

                        <div>
                            <p>Keywords</p>
                            <input type="text" id="keywords" placeholder="keywords"/>
                        </div>
                        <div>
                            <p>Дата</p>
                            <input type="text" id="date" placeholder="Текущее время"/>
                        </div>
                        <div>
                            <p>Название книги</p>
                            <input type="text" id="name_book" placeholder="Название книги"/>
                        </div>
                        <div>
                            <p>Название файла</p>
                            <input type="text" id="name_file" placeholder="Название файла"/>
                        </div>
                        <div>
                            <p>Имя</p>
                            <input type="text" id="first_name" placeholder="Имя"/>
                        </div>
                        <div>
                            <p>Фамилия</p>
                            <input type="text" id="last_name" placeholder="Фамилия"/>
                        </div>
                        <div>
                            <p>Издательство</p>
                            <input type="text" id="publisher" placeholder="Издательство"/>
                        </div>
                        <div>
                            <p>Место издания</p>
                            <input type="text" id="city" placeholder="Место издания"/>
                        </div>
                        <div>
                            <p>Серия</p>
                            <input type="text" id="sequence" placeholder="Серия"/>
                        </div>
                        <button type="button" onClick={handleClick}>Скачать файл</button>
                    </div>
                    {/* <form>
                        <label for="city">Жанр</label>
                        <select id="city" name="city">
                            <option value="moscow">Москва</option>
                            <option value="spb">Санкт-Петербург</option>
                            <option value="kazan">Казань</option>
                            <option value="novosibirsk">Новосибирск</option>
                        </select>
                        <button type="submit">Отправить</button>
                    </form> */}
                </div>
            </div>
        </main>
    );
}