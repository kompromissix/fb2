

export default function Text(){
    return(
        <>
            <FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
              <description>
                <title-info>
                  <genre>sf</genre>
                  <author>
                    <first-name>Айзек</first-name>
                    <last-name>Азимов</last-name>
                  </author>
                  <book-title>Я, робот</book-title>
                  <annotation>
                    <p>Классический сборник рассказов о роботах и трех законах роботехники.</p>
                  </annotation>
                  <date>1950</date>
                  <lang>ru</lang>
                </title-info>
                <document-info>
                  <author>
                    <nickname>DigitalLibrary</nickname>
                  </author>
                  <date>2024-01-15</date>
                  <version>1.0</version>
                </document-info>
              </description>
              <body>
                <section>
                  <title>
                    <p>Я, РОБОТ</p>
                  </title>
                  <section>
                    <title>
                      <p>Робби</p>
                    </title>
                    <p>Глория с самого утра не отходила от Робби, но ей не удавалось уговорить его играть с ней.</p>
                    <p>Робби молчал. Он был неразговорчивым роботом и не мог говорить вовсе...</p>
                  </section>
                  <section>
                    <title>
                      <p>Хоровод</p>
                    </title>
                    <p>Грегори Пауэлл снял шлем и вытер вспотевший лоб.</p>
                    <p>— Жара, — сказал он. — Должно быть, здесь все сорок пять градусов.</p>
                  </section>
                </section>
              </body>
            </FictionBook>
        </>
    )
}