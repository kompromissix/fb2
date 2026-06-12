import "./App.scss";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import logo from './Main_assets/Name.svg'
import bold from './Main_assets/bold.svg'
import Italic from './Main_assets/Italic.svg'   
import Underlining from './Main_assets/Underlining.png'
import Strikethrough from './Main_assets/Strikethrough.svg'
import Link from './Main_assets/Link.svg'
import up from './Main_assets/up.svg'
import down from './Main_assets/down.svg'
import arrow from './Main_assets/Arrow-down.svg'
import img from './Main_assets/img.svg'
import save from './Main_assets/save.svg'
export default function App() {
    const [imgfb, setImgfb] = useState([{id: '', data: ''}]);
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
    const chapterPaginationRef = useRef([]);
    const chapterSwiperRef = useRef([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [user, setUser] = useState(null)
    const getProjectData = () => ({
        tom,
        chapters,
        textfb,
        genres,
        annota,
        imgfb,
        imageData,
        form
    })
    const [form, setForm] = useState({
        keywords: '',
        name_book: '',
        first_name: '',
        last_name: '',
        city: '',
        date: '',
        name_file: '',
        publisher: '',
        sequence: ''
    });

    useEffect(() => {
        const handleBeforeUnload = (e) => {
          e.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
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
    
    useEffect(() => {
      const handler = (e) => {
        const btn = e.target.closest(".delete-chapter");
        if (!btn) return;

        const paginationEl = btn.closest("[data-tom]");
        if (!paginationEl) return;

        const tomIndex = Number(paginationEl.dataset.tom);
        const chapterIndex = Number(btn.dataset.index);

        removeChapter(tomIndex, chapterIndex);

        requestAnimationFrame(() => {
          chapterSwiperRef.current[tomIndex]?.update();
        });
      };

      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }, []);
    useEffect(() => {
        const id = localStorage.getItem('loadProjectId');

        if (id) {
            loadProject(id);
            localStorage.removeItem('loadProjectId');
        }
    }, []);
    useEffect(() => {
        const savedUser = localStorage.getItem('user')

        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])
    const handleFileChangeObloshka = (e) => {
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
    const handleFileChange = (e, index) => {
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

                const newImgfb = [...imgfb];
                newImgfb[index].data = base64String;
                setImgfb(newImgfb);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
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
    const addImg = () => {
        setImgfb([...imgfb, {id: '', data: ''}]);
    };

    const updateImg = (index, value) => {
        const newImgfb = [...imgfb];
        newImgfb[index].data = value;
        setImgfb(newImgfb);
    }
    const updateImgid = (index, value) => {
        const newImgfb = [...imgfb];
        newImgfb[index].id = value;
        setImgfb(newImgfb);
    };

    const Imgfb2 = () => {
        return imgfb
            .filter(img => img.data.trim() !== '')
            .map(img => `<binary id="${img.id}" content-type="image/jpeg">${img.data}</binary>`)
            .join('\n                  ');
    };
    const removeImgfv2 = (index) => {
        const newImgfb = imgfb.filter((_, i) => i !== index);
        setImgfb(newImgfb);
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
        setAnnota(newAnno);
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
                `<a l:href="# и ваш id слитно">${selectedText}</a>` + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        } else {
            newText = 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(0, start) + 
                '<a l:href="# и ваш id слитно"></a>' + 
                textfb[tomIndex][chapterIndex][textIndex].text.substring(end);
        }

        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);

        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start;
                textarea.selectionEnd = start + `<a l:href="# и ваш id слитно">${selectedText}</a>`.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + '<a l:href="# и ваш id слитно">'.length;
            }
            textarea.focus();
        }, 0);
    };
    const wrapTextWithImg = (tomIndex, chapterIndex, textIndex) => {
        if (
            !textareaRefs.current[tomIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex] ||
            !textareaRefs.current[tomIndex][chapterIndex][textIndex]
        ) return;
    
        const textarea = textareaRefs.current[tomIndex][chapterIndex][textIndex];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
    
        const insertText = '<image l:href="# и ваш id слитно"/>';
    
        const currentText = textfb[tomIndex][chapterIndex][textIndex].text;
    
        const newText =
            currentText.substring(0, start) +
            insertText +
            currentText.substring(end);
    
        updateText(tomIndex, chapterIndex, textIndex, 'text', newText);
    
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
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
    
        const chaptersOfTom = copy[tomIndex] || [];
        copy[tomIndex] = chaptersOfTom.filter((_, i) => i !== chapterIndex);
    
        return copy;
      });
    
      setTextfb(prev => {
        const copy = [...prev];
    
        const textsOfTom = copy[tomIndex] || [];
        copy[tomIndex] = textsOfTom.filter((_, i) => i !== chapterIndex);
    
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
        return prev.map((tom, tIdx) => {
          if (tIdx !== tomIndex) return tom;
        
          return tom.map((chapter, cIdx) => {
            if (cIdx !== chapterIndex) return chapter;
        
            return [
              ...chapter,
              { text: '' }
            ];
          });
        });
      });
    };
    const addTextbotton = (tomIndex, chapterIndex, textIndex) => {
      setTextfb(prev => {
        return prev.map((tom, tIdx) => {
          if (tIdx !== tomIndex) return tom;
        
          return tom.map((chapter, cIdx) => {
            if (cIdx !== chapterIndex) return chapter;
        
            const newChapter = [...chapter];
            newChapter.splice(textIndex + 1, 0, { text: '' });
        
            return newChapter;
          });
        });
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
            ?.filter(idItem => idItem && (idItem.id?.trim() !== ''))
            ?.map(idItem => `id="${idItem.id || ''}"`)
            ?.join('\n') || '';
    };

    const updateId = (chapterIndex, idIndex, field, value) => {
        const newId = idfb.map((chapterIds, i) => {
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

    const saveProject = async () => {
        const token = localStorage.getItem('token');
        
        const url = projectId
            ? `/api/projects/${projectId}`
            : `/api/projects`;
        
        const method = projectId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: document.getElementById('name_book').value,
                data: getProjectData()
            })
        });
      
        const project = await res.json();
      
        if (!projectId) {
            setProjectId(project.id);
        }
      
        alert('Сохранено');
    };
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
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleClick = () => {
        const {
            name_book,
            first_name,
            last_name,
            keywords,
            date,
            publisher,
            city,
            sequence,
            name_file
        } = form;

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
            ${imageData ? `
            <coverpage>
                <image l:href="#cover.jpg"/>
            </coverpage>
            ` : ''}
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
    <body>
        ${Tomfb2()}
    </body>
    <binary id="cover.jpg" content-type="image/jpeg">
      ${imageData}
    </binary>
    ${Imgfb2()}
</FictionBook>`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
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
            <section className="background1">
                <div>
                    <img src={logo} alt="" />
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
                                <Swiper modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]} initialSlide={0} onSwiper={(s) => (tomSwiperRef.current = s)} onSlideChange={(swiper) => {tomSwiperRef.current = swiper}} pagination={{el: paginationRef.current, clickable: true, renderBullet: (i, className) => {return `<div class="${className}"> <span>${i + 1}</span> <button data-delete="${i}">&#215;</button> </div>`}}} onBeforeInit={(swiper) => {swiper.params.pagination.el = paginationRef.current;}} spaceBetween={50} slidesPerView={1} navigation = {false}  direction='horizontal' allowTouchMove = {false}>
                                    {tom.map((tomItem, tomIndex) => (
                                    <SwiperSlide>
                                        <div key={tomIndex} className="tom">
                                            <div>
                                                <p>Глава</p>
                                                <div>
                                                    <div data-tom={tomIndex} ref={el => (chapterPaginationRef.current[tomIndex] = el)} />
                                                    <button onClick={() => addChapter(tomIndex)}>+</button>
                                                </div>
                                            </div>

                                            <Swiper modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]} initialSlide={0} onSwiper={(s) => (chapterSwiperRef.current[tomIndex] = s)} onSlideChange={(swiper) => {chapterSwiperRef.current = swiper}} pagination={{el: chapterPaginationRef.current[tomIndex], clickable: true, renderBullet: (i, className) => {return `<div class="${className}"> <span>${i + 1}</span> <button class="delete-chapter" data-index="${i}">&#215;</button> </div>`}}} onBeforeInit={(swiper) => {swiper.params.pagination.el = chapterPaginationRef.current[tomIndex]}} spaceBetween={50} slidesPerView={1} navigation = {false}  direction='horizontal' allowTouchMove = {false}>
                                                {chapters[tomIndex]?.map((chapter, chapterIndex) => (
                                                    <SwiperSlide>
                                                        <div key={chapterIndex} className="chapter">
                                                            <div>
                                                                <textarea value={tomItem.tom} onChange={e => updateTom(tomIndex, 'tom', e.target.value)} placeholder="Название тома"/>
                                                                <textarea value={chapter.chapter} onChange={e => updateChapter(tomIndex, chapterIndex, 'chapter', e.target.value)} placeholder="Название главы"/>
                                                            </div>
                                                            <div>
                                                                {textfb[tomIndex][chapterIndex]?.map((textItem, textIndex) => (
                                                                    <div key={textIndex} className="texts">
                                                                        <div>
                                                                            <textarea value={textItem.text} ref={el => {if (!textareaRefs.current[tomIndex]) {textareaRefs.current[tomIndex] = []} if (!textareaRefs.current[tomIndex][chapterIndex]) {textareaRefs.current[tomIndex][chapterIndex] = []} textareaRefs.current[tomIndex][chapterIndex][textIndex] = el}} onChange={e => updateText(tomIndex, chapterIndex, textIndex, 'text', e.target.value)} placeholder="Новый абзац" />
                                                                            <button onClick={() => removeText(tomIndex, chapterIndex, textIndex)}>&#215;</button>
                                                                        </div>
                                                                        <div>
                                                                            <button
                                                                            onClick={() =>
                                                                                setOpenMenu(prev =>
                                                                                prev === `${tomIndex}-${chapterIndex}-${textIndex}` ? null : `${tomIndex}-${chapterIndex}-${textIndex}`
                                                                                )
                                                                            }
                                                                            >
                                                                            |||
                                                                            </button>
                                                                            <div>
                                                                                {openMenu === `${tomIndex}-${chapterIndex}-${textIndex}` && (
                                                                                    <div>
                                                                                        <button onClick={() => addTextbotton(tomIndex, chapterIndex, textIndex)}>+</button>
                                                                                        <button onClick={() => wrapTextWithStrong(tomIndex, chapterIndex, textIndex)}> <img src={bold} alt="" /> </button>
                                                                                        <button onClick={() => wrapTextWithEmphasis(tomIndex, chapterIndex, textIndex)}> <img src={Italic} alt="" /></button>
                                                                                        <button onClick={() => wrapTextWithLink(tomIndex, chapterIndex, textIndex)}> <img src={Link} alt="" /></button>
                                                                                        <button onClick={() => wrapTextWithImg(tomIndex, chapterIndex, textIndex)}> <img src={img} alt="" /></button>
                                                                                        <button onClick={() => wrapTextWithStrikethrough(tomIndex, chapterIndex, textIndex)}> <img src={Strikethrough} alt="" /></button>
                                                                                        <button onClick={() => wrapTextWithSup(tomIndex, chapterIndex, textIndex)}> <img src={up} alt="" /></button>
                                                                                        <button onClick={() => wrapTextWithSub(tomIndex, chapterIndex, textIndex)}> <img src={down} alt="" /></button>                                                                            </div>
                                                                                )}
                                                                            </div>

                                                                        </div>

                                                                    </div>
                                                                ))}
                                                                {}
                                                                <button onClick={() => addText(tomIndex, chapterIndex)}>+</button>
                                                            </div>

                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div>
                                <p>Аннотация</p>
                                <div>
                                    {annota.map((annoItem, annoIndex) => (
                                        <div key={annoIndex}>
                                            <textarea value={annoItem} onChange={(e) => updateAnno(annoIndex, e.target.value)} placeholder="Аннотация"/>
                                            <button onClick={() => removeAnno(annoIndex)}>&#215;</button>
                                        </div>
                                    ))}
                                    <button onClick={() => addAnno()}>+</button>
                                </div>
                            </div>

                            <div>

                                <div>
                                    <div>
                                        <p>Keywords</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="keywords" value={form.keywords} onChange={handleInputChange} placeholder="keywords"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Название книги</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="name_book" value={form.name_book} onChange={handleInputChange} placeholder="Название книги"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Имя</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="first_name" value={form.first_name} onChange={handleInputChange} placeholder="Имя"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Фамилия</p>                                
                                        <div>
                                            <div/>
                                            <input type="text" id="last_name" value={form.last_name} onChange={handleInputChange} placeholder="Фамилия"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Место издания</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="city" value={form.city} onChange={handleInputChange} placeholder="Место издания"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p>Дата</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="date" value={form.date} onChange={handleInputChange} placeholder="Текущее время"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Название файла</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="name_file" value={form.name_file} onChange={handleInputChange} placeholder="Название файла"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Издательство</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="publisher" value={form.publisher} onChange={handleInputChange} placeholder="Издательство"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Серия</p>
                                        <div>
                                            <div/>
                                            <input type="text" id="sequence" value={form.sequence} onChange={handleInputChange} placeholder="Серия"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Обложка</p>
                                        <div>
                                            <label className={imageData ? "label green" : "label"} for={`oblo`}>Нажмите, чтобы добавить</label>
                                            <input type="file" id="oblo" ref={fileInputRef} onChange={handleFileChangeObloshka} accept="image/*"/>
                                            <button type="button" onClick={() => {setImageData(null); if (fileInputRef.current) {fileInputRef.current.value = ""}}}>Удалить</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div>
                                    <p>Жанры:</p>
                                    <div>
                                        {genres.map((genre, index) => (
                                            <div key={index}>
                                                <select value={genre} onChange={(e) => updateGenre(index, e.target.value)}>
                                                    <option value=""></option>
                                                    <option value="sf_history">Альтернативная история</option>
                                                    <option value="sf_action">Боевая Фантастика</option>
                                                    <option value="sf_epic">Эпическая Фантастика</option>
                                                    <option value="sf_heroic">Героическая фантастика</option>
                                                    <option value="sf_detective">Детективная Фантастика</option>
                                                    <option value="sf_cyberpunk">Киберпанк</option>
                                                    <option value="sf_space">Космическая Фантастика</option>
                                                    <option value="sf_social">Социальная фантастика</option>
                                                    <option value="sf_horror">Ужасы и Мистика</option>
                                                    <option value="sf_humor">Юмористическая фантастика</option>
                                                    <option value="sf_fantasy">Фэнтези</option>
                                                    <option value="sf">Научная Фантастика</option>
                                                    <option value="child_sf">Детская Фантастика</option>
                                                    <option value="det_classic">Классический Детектив</option>
                                                    <option value="det_police">Полицейский Детектив</option>
                                                    <option value="det_action">Боевики</option>
                                                    <option value="det_irony">Иронический Детектив</option>
                                                    <option value="det_history">Исторический Детектив</option>
                                                    <option value="det_espionage">Шпионский Детектив</option>
                                                    <option value="det_crime">Криминальный Детектив</option>
                                                    <option value="det_political">Политический Детектив</option>
                                                    <option value="det_maniac">Маньяки</option>
                                                    <option value="det_hard">Крутой Детектив</option>
                                                    <option value="thriller">Триллеры</option>
                                                    <option value="detective">Детектив</option>
                                                    <option value="sf_detective">Детективная Фантастика</option>
                                                    <option value="child_det">Детские Остросюжетные</option>
                                                    <option value="love_detective">Остросюжетные Любовные Романы</option>
                                                    <option value="prose">Проза</option>
                                                    <option value="prose_classic">Классическая Проза</option>
                                                    <option value="prose_history">Историческая Проза</option>
                                                    <option value="prose_contemporary">Современная Проза</option>
                                                    <option value="prose_counter">Контркультура</option>
                                                    <option value="prose_rus_classic">Русская Классика</option>
                                                    <option value="prose_su_classics">Советская Классика</option>
                                                    <option value="humor_prose">Юмористическая Проза</option>
                                                    <option value="child_prose">Детская Проза</option>
                                                    <option value="love">Любовные романы</option>
                                                    <option value="love_contemporary">Современные Любовные Романы</option>
                                                    <option value="love_history">Исторические Любовные Романы</option>
                                                    <option value="love_detective">Остросюжетные Любовные Романы</option>
                                                    <option value="love_short">Короткие Любовные Романы</option>
                                                    <option value="love_erotica">Эротика</option>
                                                    <option value="adv_western">Вестерны</option>
                                                    <option value="adv_history">Исторические Приключения</option>
                                                    <option value="adv_indian">Приключения: Индейцы</option>
                                                    <option value="adv_maritime">Морские Приключения</option>
                                                    <option value="adv_geo">Путешествия и География</option>
                                                    <option value="adv_animal">Природа и Животные</option>
                                                    <option value="adventure">Приключения: Прочее</option>
                                                    <option value="child_adv">Детские Приключения</option>
                                                    <option value="children">Детское</option>
                                                    <option value="child_tale">Сказки</option>
                                                    <option value="child_verse">Детские Стихи</option>
                                                    <option value="child_prose">Детская Проза</option>
                                                    <option value="child_sf">Детская Фантастика</option>
                                                    <option value="child_det">Детские Остросюжетные</option>
                                                    <option value="child_adv">Детские Приключения</option>
                                                    <option value="child_education">Детская Образовательная литература</option>
                                                    <option value="children">Детское: Прочее</option>
                                                    <option value="poetry">Поэзия</option>
                                                    <option value="dramaturgy">Драматургия</option>
                                                    <option value="humor_verse">Юмористические Стихи</option>
                                                    <option value="child_verse">Детские Стихи</option>
                                                    <option value="antique_ant">Античная Литература</option>
                                                    <option value="antique_european">Европейская Старинная Литература</option>
                                                    <option value="antique_russian">Древнерусская Литература</option>
                                                    <option value="antique_east">Древневосточная Литература</option>
                                                    <option value="antique_myths">Мифы. Легенды. Эпос</option>
                                                    <option value="antique">Старинная Литература: Прочее</option>
                                                    <option value="sci_history">История</option>
                                                    <option value="sci_psychology">Психология</option>
                                                    <option value="sci_culture">Культурология</option>
                                                    <option value="sci_religion">Религиоведение</option>
                                                    <option value="sci_philosophy">Философия</option>
                                                    <option value="sci_politics">Политика</option>
                                                    <option value="sci_business">Деловая литература</option>
                                                    <option value="sci_juris">Юриспруденция</option>
                                                    <option value="sci_linguistic">Языкознание</option>
                                                    <option value="sci_medicine">Медицина</option>
                                                    <option value="sci_phys">Физика</option>
                                                    <option value="sci_math">Математика</option>
                                                    <option value="sci_chem">Химия</option>
                                                    <option value="sci_biology">Биология</option>
                                                    <option value="sci_tech">Технические</option>
                                                    <option value="science">Научно-образовательная: Прочее</option>
                                                    <option value="adv_animal">Природа и Животные</option>
                                                    <option value="comp_www">Интернет</option>
                                                    <option value="comp_programming">Программирование</option>
                                                    <option value="comp_hard">Компьютерное Железо</option>
                                                    <option value="comp_soft">Программы</option>
                                                    <option value="comp_db">Базы Данных</option>
                                                    <option value="comp_osnet">ОС и Сети</option>
                                                    <option value="computers">Компьютеры: Прочее</option>
                                                    <option value="ref_encyc">Энциклопедии</option>
                                                    <option value="ref_dict">Словари</option>
                                                    <option value="ref_ref">Справочники</option>
                                                    <option value="ref_guide">Руководства</option>
                                                    <option value="reference">Справочная Литература: Прочее</option>
                                                    <option value="nonf_biography">Биографии и Мемуары</option>
                                                    <option value="nonf_publicism">Публицистика</option>
                                                    <option value="nonf_criticism">Критика</option>
                                                    <option value="nonfiction">Документальное: Прочее</option>
                                                    <option value="design">Искусство, Дизайн</option>
                                                    <option value="adv_animal">Природа и Животные</option>
                                                    <option value="religion">Религия</option>
                                                    <option value="religion_rel">Религия</option>
                                                    <option value="religion_esoterics">Эзотерика</option>
                                                    <option value="religion_self">Самосовершенствование</option>
                                                    <option value="religion">Религия и духовность: Прочее</option>
                                                    <option value="sci_religion">Религиоведение</option>
                                                    <option value="humor_anecdote">Анекдоты</option>
                                                    <option value="humor_prose">Юмористическая Проза</option>
                                                    <option value="humor_verse">Юмористические Стихи</option>
                                                    <option value="humor">Юмор: Прочее</option>
                                                    <option value="home_cooking">Кулинария</option>
                                                    <option value="home_pets">Домашние Животные</option>
                                                    <option value="home_crafts">Хобби, Ремесла</option>
                                                    <option value="home_entertain">Развлечения</option>
                                                    <option value="home_health">Здоровье</option>
                                                    <option value="home_garden">Сад и Огород</option>
                                                    <option value="home_diy">Сделай Сам</option>
                                                    <option value="home_sport">Спорт</option>
                                                    <option value="home_sex">Эротика, Секс</option>
                                                    <option value="home">Дом и Семья: Прочее</option>
                                                </select>
                                                <img src={arrow} alt="" />
                                                <button onClick={() => removeGenre(index)}>&#215;</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addGenre}>+ Добавить жанр</button>
                                    </div>
                                </div>
                                <div>
                                    <p>Добавление фотографий:</p>
                                    <div>
                                        {imgfb.map((img, index) => (
                                            <div key={index}>
                                                <div>
                                                    <input type="text" value={img.id} onChange={(e) => updateImgid(index, e.target.value)} placeholder="id"/>
                                                    <label for={`file-upload-${index}`}>Нажмите, чтобы добавить</label>
                                                    <input type="file" id={`file-upload-${index}`} onChange={(e) => handleFileChange(e, index)} placeholder="Картинка" accept="image/*"/>
                                                    <button onClick={() => removeImgfv2(index)}>&#215;</button>
                                                </div>
                                                <textarea  value={img.data} readOnly />
                                            </div>
                                        ))}
                                        <button type="button" onClick={addImg}>+ Добавить картинку</button>
                                    </div>

                                </div>
                            </div>
                            <button type="button" onClick={handleClick}>СОЗДАТЬ FB2</button>
                        </div>
                    </div>
                </div>
                {user &&(
                    <div>
                        <button onClick={saveProject}><img src={save} alt="" /></button>
                    </div>
                )}
            </section>

        </main>
    );
}