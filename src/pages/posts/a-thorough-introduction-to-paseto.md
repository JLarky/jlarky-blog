---
layout: ../../layouts/PostLayout.astro
title: "Подробное введение в PASETO (translated to Russian)"
date: "2020-05-09"
og:image: "https://developer.okta.com/assets-jekyll/blog/a-thorough-introduction-to-paseto/an-introduction-to-paseto-41ea2679a51c2c39a410020c2159d4f915165897f3ce575f9a659d0ec77fd324.png"
---

<blockquote class="mt-6 relative p-4 text-xl italic border-l-4 bg-gray-200 text-gray-600 border-gray-500 quote" title="This article is a translation of 'A Thorough Introduction to PASETO' by Randall Degges">
    {"Данная статья является переводом "}
    <a
        href="https://developer.okta.com/blog/2019/10/17/a-thorough-introduction-to-paseto"
        target="_blank"
        rel="noopener noreferrer"
        class="text-teal-500 no-underline hover:text-teal-400 hover:underline"
    >
        A Thorough Introduction to PASETO
    </a>
    {" написанная "}
    <a
        href="https://developer.okta.com/blog/authors/randall-degges/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-700 no-underline hover:text-gray-900 hover:underline"
    >
        Randall Degges
    </a>
</blockquote>


Сегодня я хочу познакомить вас с одной из моих любимых технологий безопасности из тех, что были выпущены за последние несколько лет: **PASETO** (_platform-agnostic security tokens_). PASETO - сравнительно новый протокол, разработанный [Скоттом Аркишевски](https://paragonie.com/) в начале 2018 года, который быстро завоевывает признание в кругах тех, кто занимается безопасностью.

Так как PASETO до сих пор считается молодой технологией, я подумал, что было бы интересно изучить ее подробнее, поскольку она невероятно полезна и решает множество проблем безопасности с помощью спецификаций семейства JOSE (_включая веб-токены JSON_), с которыми многие знакомы.

Если вам интересно узнать больше о PASETO, читайте дальше!

## Что такое PASETO?

[PASETO](https://paseto.io/) является новой спецификацией (_в наcтоящее время это проект RFC_), которая позволяет создавать надежные и независимые токены (такими можно безопасно делиться в сети).

По сути, PASETO позволяет вам брать данные JSON и объединять их в единый токен, которым вы с легкостью можете обмениваться через интернет безопасным, защищенным способом. Это полезно при ряде различных обстоятельств.

Если вы наслышаны о веб-токенах JSON (JWTs), то могу сказать, что PASETO очень на них похожи. По факту, PASETO был разработан как более простая и безопасная альтернатива JWTs. Формат PASETO практически идентичен формату JWT, и случаи их использования аналогичны.

Мне нравится представлять PASETO как "Веб-токены JSON: лучшие части". Знакомо звучит?

![blog/a-thorough-introduction-to-paseto/json-web-tokens-the-good-parts.jpg](https://d33wubrfki0l68.cloudfront.net/90017427b22aae32d42fbf3a971faf2b3d35ec65/aa31d/assets-jekyll/blog/a-thorough-introduction-to-paseto/json-web-tokens-the-good-parts-0d4bc980e0cbc5f542f521ce7f673a14890e8726df21a2d20f5061a49d658bc7.jpg)

## Структура токена PASETO

PASETO - это не что иное, как простые строки в кодировке base64. Вот пример того, как выглядит одна из них.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">v2.local.sIgVm0es9uswZliPdyXOOi99czPbpl41KOUu45e62BvCaL5H3kHNibrbRZkM1-wW091ARzNexLY8g0GZA0-WCNsgs8GZLClEk5TJbgQjf__yExZRh2qMnqxfVr_KS9WoqKVlU-WrAG6TRUXZo43OSJQkeNBnB8Gq4rN2A8HYeA3ms20up80dgz2rpY79F9ILvPrAIzxNkDSE51vAxv50BTShuel3F3hXgReHsDv2PJCnMBnMyE_AfePxJ6WJ1obXSIUpSsOQX6wjwdQdOIcXZ853c-NPYMVU-abXJhhLVvvHyNZPi1wcEvjt.eyJraWQiOiAiMTIzNDUifQ</code></pre>

Этот PASETO был создан из следующего JSON объекта.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">{`{
  "exp": "2019-10-09T13:59:13-07:00",
  "id": "59e5d078-8783-4c64-bed2-3c759e47b477",
  "name": "Randall Degges",
  "permissions": [
    "download:file-a.mp4",
    "download:file-b.mp4",
    "download:file-c.mp4"
  ]
}`}</code></pre>

PASETO можно разделить на 3 (_иногда 4_) сегмента, которые разделены точками.

Первый сегмент PASETO - это версия протокола (**version**) (`v2`). Он дает понять, какая версия стандарта PASETO в данном конкретном случае используется. На момент написания этой статьи существует две версии стандарта PASETO.

Второй сегмент PASETO - это цель (**purpose**) (`local`). PASETO определяет для токенов только 2 цели: локальную (`local`) и публичную (`public`). Углубимся в это позже. Пока просто знайте, что локальная цель - это та, которую я здесь демонстрирую.

Третий сегмент PASETO определяет текущее содержимое токена, также известное как полезная нагрузка (**payload**):

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">sIgVm0es9uswZliPdyXOOi99czPbpl41KOUu45e62BvCaL5H3kHNibrbRZkM1-wW091ARzNexLY8g0GZA0-WCNsgs8GZLClEk5TJbgQjf__yExZRh2qMnqxfVr_KS9WoqKVlU-WrAG6TRUXZo43OSJQkeNBnB8Gq4rN2A8HYeA3ms20up80dgz2rpY79F9ILvPrAIzxNkDSE51vAxv50BTShuel3F3hXgReHsDv2PJCnMBnMyE_AfePxJ6WJ1obXSIUpSsOQX6wjwdQdOIcXZ853c-NPYMVU-abXJhhLVvvHyNZPi1wcEvjt</code></pre>

Полезная нагрузка - это на самом деле не что иное, как зашифрованный JSON объект, который вы указываете при создании токена. Если у вас есть правильный ключ, то вы можете расшифровать его и посмотреть исходные данные JSON.

Наконец, есть дополнительный, четвертый сегмент PASETO, который называется футер (**footer**) (`eyJraWQiOiAiMTIzNDUifQ`). Футер можно использовать для хранения дополнительных метаданных в незашифрованном виде. Это полезно в случаях когда вам нужно выполнить вещи вроде ротации ключей и т.д. Но объяснение оставим на потом.

Если соединить все сегменты вместе, то у PASETO будет следующий формат:

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">version.purpose.payload.optional_footer</code></pre>

## Как работают PASETO?

Теперь, когда вы знаете, из чего складываются PASETO, давайте рассмотри, как на самом деле они _работают_.

Как я уже упоминал выше, PASETO можно использовать для двух разных целей: симметричной (_она же локальная_) и ассиметричная (_она же публичная_). Ниже я объясню, как работает каждый тип PASETO, ибо функционируют они по-разному.

## Как работает локальный (симметричный) PASETO

Локальные PASETO всегда создаются и шифруются с помощью секретного ключа (_можно рассматривать его как длинный пароль_).

Библиотека разработчика PASETO будет принимать данные JSON, которые вы хотите безопасно передавать и щифровать с помощью своего секретного ключа. В дальнейшем локальный PASETO можно расшифровать с использованием того же секретного ключа, что вы использовали при его создании.

![How local PASETOs are created](https://d33wubrfki0l68.cloudfront.net/05cf7b38eec12cfae5101d7db231f67af55c9f83/a47c8/assets-jekyll/blog/a-thorough-introduction-to-paseto/create-local-paseto-3847723ded33848124bd7db77bbfeb2b36095b0205791b3546fad813c76663a4.png)

Если кто-то перехватит локальный токен PASETO, он не сможет извлечь из него ничего полезного, не имея того самого секретного ключа. До тех пор, пока вы храните свой секретный ключ в безопасности, ваш PASETO тоже находится в безопасности, даже если он находится в общем доступе.

Способ создания локальных PASETO относительно прост:

- Случайная функция безопасности генерирует случайную строку байтов
- Алгоритм криптографического хэширования [blake2b](<https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2>) использует случайную строку байтов в качестве входных данных для создания [одноразового номера](https://en.wikipedia.org/wiki/Cryptographic_nonce). Выбран именно blake2b, потому что намного быстрее, чем другие функции криптографического хэширования, при этом оставаясь, _по крайней мере_, таким же безопасным, как SHA-3 (_и простым в использовании_).
- Заголовок PASETO (`v2.local`) объединяется с одноразовым номером и футером (_если есть_) для создания строки предварительной аутентификации
- Полезная нагрузка токена (_все ваши данные JSON_) потом шифруется с помощью [XChaCha20-Poly1305](https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction) (_шифрование для аутентификации_), используя ваш секретный ключ вместе со строкой предварительной аутентификации для обеспечения целостности вашего PASETO.
- Наконец, создается строка токена в форме `v2.local.payload.optional_footer`

После того, как строка токена в 5 шаге была создана, вы можете безопасно делиться токеном с любым носителем (публично или в частном порядке через интернет) без каких-либо опасений.

Поскольку токен зашифрован, злоумышленники не смогут увидеть какие-либо данные вашей полезной нагрузки, не имея секретного ключа. А поскольку токен аутентифицирован, ни один злоумышленник не сможет изменить ваш токен без вашего ведома - если вы получаете модифицированный токен, то при попытке _расшифровать_ его вы наткнетесь на ошибку неудачной аутентификации.

Если же вы хотите прочитать точную формулу создания локального PASETO, ознакомьтесь с [RFC](https://paseto.io/rfc/), который объясняет процесс очень подробно.

## Как работает публичный (ассиметричный) PASETO

Публичный PASETO идеален для сред, в которых вы не можете безопасно делиться секретным ключом со всеми сторонами, вовлеченными в транзакцию.

Публичные PASETO не зашифрованы (_так как вы убеждены в том, что не можете безопасно делиться секретным ключом со всеми сторонами, которые будут взаимодействовать с PASETO_), но _подписаны_ цифровой подписью. Это означает, что если злоумышленник завладеет вашим публичным PASETO, он сможет увидеть все содержащиеся в нем данные, но _не сможет_ их изменить без вашего ведома благодаря использованию цифровых подписей PASETO.

Если вы попытаетесь проверить публичный PASETO, который был злонамеренно изменен, вы получите ошибку.

![How public PASETOs are created](https://d33wubrfki0l68.cloudfront.net/9ef91e4d893c4b6a351562050123025bb34056ef/cbd99/assets-jekyll/blog/a-thorough-introduction-to-paseto/create-public-paseto-077df98cad1832cb03d1bcdce37b34ce2f621488a277ad7938485362ba33ac9d.png)

Теперь о том, как создается публичный PASETO:

1. [libsodium](https://libsodium.gitbook.io/doc/) (_крайне рекомендуемый инструментарий криптографии с простым API_) используется для создания пары открытый/закрытый ключ
1. Заголовок PASETO (`v2.public`) объединяется с содержимым полезной нагрузки и футером в строку предварительной аутентификации
1. Цифровая подпись этой строки создаётся закрытым ключом используя Ed25519, быстрой и безопасной системы подписи открытым ключом
1. Все это упаковано вместе в PASETO в строку формата: `v2.public.<signed string>.footer`

Как только вы получили строку токена, вы можете безопасно делиться ею с третьими лицами, не беспокоясь о том, смогут ли злоумышленники ее изменить.

И как только ваш токен создан, вы также можете поделиться своим открытым ключом со всеми сторонами, которые хотели бы проверить этот токен. Любой, у кого естькопия вашего открытого ключа (_которым вы свободно можете делиться_), сможет проверить действительность этого токена.

## Как работают требования (заявки, claims) PASETO

Подобно веб-токенам JSON, PASETO могут содержать в себе _требования_. Кратко говоря, требования - это просто ключи JSON.

Например, представим, что вы создали PASETO из следующего JSON объекта.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">{`{
  "eyeColor": "brown",
  "height": "6'0",
  "weight": "220lbs"
}`}</code></pre>

В этом примере, `eyeColor`, `height` и `weight` являются _требованиями_ вашего токена.

Стандарт PASETO определяет несколько зарезервированных требований, которые вы не можете использовать для каких-либо целей, кроме их официальных. Это следующие требования (_взято непосредственно с [PASETO RFC](https://paseto.io/rfc/)_).

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">{`+-----+------------+--------+-------------------------------------+
| Key |    Name    |  Type  |               Example               |
+-----+------------+--------+-------------------------------------+
| iss |   Issuer   | string |       {"iss":"paragonie.com"}       |
| sub |  Subject   | string |            {"sub":"test"}           |
| aud |  Audience  | string |       {"aud":"pie-hosted.com"}      |
| exp | Expiration | DtTime | {"exp":"2039-01-01T00:00:00+00:00"} |
| nbf | Not Before | DtTime | {"nbf":"2038-04-01T00:00:00+00:00"} |
| iat | Issued At  | DtTime | {"iat":"2038-03-17T00:00:00+00:00"} |
| jti |  Token ID  | string |  {"jti":"87IFSGFgPNtQNNuw0AtuLttP"} |
| kid |   Key-ID   | string |    {"kid":"stored-in-the-footer"}   |
+-----+------------+--------+-------------------------------------+`}</code></pre>

Эти требования имеют специальные цели, и реализации PASETO позволяют испольщовать их для выполнения полезных функций.

Например, при создании PASETO вы можете выбрать, как долго он будет оставаться действительным. Когда вы это сделаете, реализации будут вычислять как `Время выдачи`, так и `Время Истечения` и назначать эти значения для требований `iat` и `exp` в вашем токене, соответственно.

Это позволяет вам определить, как долго токен будет оставаться действительным, простым прямым способом.

<blockquote class="mt-6 relative p-4 text-xl italic border-l-8 bg-blue-100 text-gray-600 border-blue-700 quote">
    <strong>НА ЗАМЕТКУ</strong>: при создании токенов всегда учитывайте модель безопасности вашего приложения, прежде чем выбрать срок действия. Токены должны быть действительны только в течение короткого промежутка времени, чтобы предотвратить возможное злоупотребление ими. <strong>Чем дольше токену разрешено оставаться действительным, тем больше вероятность злоупотребления.</strong>
</blockquote>

## Какие проблемы решают PASETO токены?

PASETO разработаны как одноразовые токены, предназначенные для безопасной передачи данных JSON через интернет. Если у вас есть некоторые данные JSON, которые необходимо безопасно передавать по небезопасным каналам, PASETO поможет вам в этом.

Поскольку PASETO решают две разные проблемы, я опишу каждую из них в подразделах ниже.

## Какие проблемы решают локальные PASETO

Как уже упоминалось ранее, вам следует использовать локальные PASETO в случаях, когда вы можете безопасно хранить общий секретный ключ.

Например, представим, что вы создаете веб-приложение, которое позволяет пользователям покупать и загружать видеофайлы. Ваше веб-приложение должно состоять из 2 отдельных служб: вебсайта, который обеспечивает поддержку пользователей и потоки покупок, и сервиса загрузки, которая позволяет пользователям загружать файлы, за которые они заплатили.

При таком сценарии и ваш вебсайт, и сервис загрузки работают на стороне сервера, который может безопасно хранить общий секретный ключ (_допустим, в переменных средах или других частных, изолированных местах_).

Когда пользователь покупает видеофайл, ваш вебсайт генерирует локальный токен PASETO, в котором содержится подробная информация о покупке пользователя:

- Идентификатор покупки
- Приобретенный видеофайл
- Временная отметка
- И т.д.

Затем вебсайт с помощью PASETO перенаправит браузер пользователя на сервис загрузки в параметре URL (например, `https://download.example.com?token=v2.local.xxx?file=video1.mp4`). Сервис загрузки получит этот запрос, проанализирует параметр `token` из URL-адреса и расшифрует локальный PASETO. Затем сервис загрузки сможет проверить идентификатор покупки и позволит пользователю загрузить файл, указанный в параметрах строки запроса, но только при условии, что это позволяет PASETO.

![How to use local PASETOs](https://d33wubrfki0l68.cloudfront.net/4b0bf94a502f80d08056d91587b1a3aa4f8cb391/9a947/assets-jekyll/blog/a-thorough-introduction-to-paseto/how-to-use-local-pasetos-1116dd746b1e11a4f5dcfa5e22016d7da449405d3deb0f1bccb90d7ef10bb949.gif)

<blockquote class="mt-6 relative p-4 text-sm italic border-l-4 bg-gray-200 text-gray-600 border-gray-500 quote has-paragraphs">
Пользователь: я хочу скачать video1.mp4

wwww. севрер знает secret_key:

- проверяет запрос
- создаёт PASETO
- перенаправляет

в URL передаются параметры file=video1.mp4 и token

в полезной нагрузке токена передаётся purchaseID и permissions

dl. сервер знает secret_key:

- получает параметры из URL
- расшифровывает токен
- проверяет purchaseID
- проверяет permissions
- передаёт файл пользователю
</blockquote>

Эта система работает, потому что оба сервиса, касающиеся PASETO, могут безопасно делиться секретным ключом.

## Какие проблемы решают публичные PASETO

Идеальный случай для использования публичных PASETO - необходимость передачи данных JSON таким образом, чтобы другие люди могли сказать, что данные JSON были созданы вами. Оказывается, это проблема, которая особенно актуальна в мире веб-аутентификации.

Представим, что вы создаете и защищаете вебсайт с использованием протокола типа [OpenID Connect](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1). В этом сценарии у вас есть:

- Пользователь
- Вебсайт, на который пользователь хочет войти
- Сервер авторизации, который контролирует логины и пароли пользователей

Аутентификация в данном случае может работать с использованием публичных PASETO в следующем порядке:

1. Пользователь заходит на сайт и нажимает кнопку входа
1. Пользователь перенаправляется на сервер авторизации для входа в систему (`https://id.example.com/login`)
1. Пользователь вводит свои учетные данные в веб-форму для аутентификации
1. Сервер авторизации проверяет учетные данные пользователя и создает публичный PASETO, используя закрытый ключ, к которому имеет доступ только авторизационный сервер. Этот PASETO будет включать в себя требование, которое предоставляет аутентификатор пользователя.
1. Затем сервер авторизации перенаправляет пользователя на вебсайт с публичным PASETO в качестве параметра URL (`https://example.com/dashboard?token=v2.public.xxx`)
1. Вебсайт получает запрос пользователя на переход на страницу панели инструментов и анализирует PASETO из параметра URL-адреса токена
1. Вебсайт проверяет PASETO, а затем создает для пользователя долгоживущую сессию с использованием безопасных файлов cookie и стандартных потоков управления сессиями на стороне сервера
1. Теперь пользователь аутенифицирован на вебсайте с использованием PASETO, чтобы сделать возможным дальнейший процесс аутентификации

![How to use public PASETOs](https://d33wubrfki0l68.cloudfront.net/510ca75f511217f250096e4b96e4246931078344/13f41/assets-jekyll/blog/a-thorough-introduction-to-paseto/how-to-use-public-pasetos-47e795cc5fdf69e6edeafd0731a817e04526651f07315649b3efb147fec23299.gif)

<blockquote class="mt-6 relative p-4 text-sm italic border-l-4 bg-gray-200 text-gray-600 border-gray-500 quote has-paragraphs">
Пользователь: я хочу авторизоваться

вебсайт перенаправляет пользователя на сервер авторизации

сервер авторизации знает private_key и public_key

- авторизует пользователя
- создаёт PASETO
- перенаправляет пользователя обратно на вебсайт

в URL передаётся параметр token вида `v2.public.xxx`

в полезной нагрузке токена передаётся `userID`

вебсайт знает public_key:

- получает параметр `token` из URL
- проверяет подпись токена
- создаёт защищённую сессию используя
  серверный механизм управления сессией
</blockquote>

В этом примере, пожалуйста, обратите внимание , что приведенный выше PASETO _используется только один раз_: для информирования вебсайта об успешной аутентификации пользователя через сервес авторизации. Следует также отметить, что этот поток работает только тогда, когда вебсайт имеет доступ к **открытому ключу** сервера авторизации. Этот открытый ключ _необходим_ для того, чтобы вебсайт мог проверить действительность PASETO, отправленного ему сервером авторизации.

Когда сессия пользователя истекает, пользователь должен пройти повторную аутентификацию, и в этом случае вебсайт перенаправит пользователя обратно на сервер авторизации для повторной аутентификации.

## Важные случаи использования, которые PASETO не решают

В то время как PASETO полезны в ряде различных ситуаций, я хотел бы указать один явный случай использования, для решения которого PASETO _не_ предназначен.

**PASETO _не_ предназначены для многократного использования.**

PASETO следует использовать только один раз, поскольку у них нет встроенного механизма для предотвращения [атак повторного воспроизведения](https://en.wikipedia.org/wiki/Replay_attack). Если злоумышленник способен перехватить действительный PASETO и использовать его для многократного выполнения дейсвительных запросов, значит, вы используете PASETO неправильно.

В частности, это означает, что вы _не_ должны использовать PASETO в качестве долговременных токенов доступа в потоках веб-аутентификации.

Например, многие разработчики полагаются на потоки аутентификации на основе токенов, которые работают примерно так:

- Пользователь отправляет сво имя пользователя и пароль на сайт
- Вебсайт проверяет учетные данные пользователя
- Вебсайт генерирует веб-токен JSON, который содержит информацию о пользователе и истекает через один день
- Затем пользователь сохраняет JWT в браузере
- Когда пользователь делает последующие запросы на сайте , он отправляет этот JWT на сайт, чтобы идентифицировать себя
- Вебсайт анализирует JWT, проверяет его локально (гарантирует, что он не был подделан и не истек), а затем разрешает выполнить запросъ

В этом потоке вебсайт использует JWT как подтверждение личности для пользователя и делает это **много раз** (_а именно каждый раз, когда пользователь делает еще один запрос на вебсайте_).

Это тот самый сценарий, в котором вы не захотите использовать PASETO, так как нет никакого способа помешать злоумышленнику, у которого есть PASETO (_ну или JWT_), который они сами могут использовать, чтобы выдать себя за пользователя или вызвать другие проблемы безопасности.

Многие разработчики реализуют приведенный выше шаблон аутентификации как способ ускорить свои приложения посредством устранения необходимости управления сессиями на стороне сервера, но это сопряжено с большим риском привлечь злоумышленников.

## Как вам следует использовать PASETO?

Чтобы начать использовать PASETO в своих приложениях, загляните на [вебсайт PASETO](https://paseto.io/), где перечислены различные библиотеки с открытым исходным кодом, которые можно использовать для работы со стандартом PASETO.

Эталонная реализация встроена в PHP, но вы в настоящее время можете выбрать одну из 15 доступных библиотек. Ниже я привел несколько примеров, демонстрирующих, как создавать и проверять PASETO в Python с использованием библиотеки [pypaseto](https://github.com/rlittlefield/pypaseto).

Я специально выбрал для демонстрации примеров Python, потому что код Python универсален для чтения и легок в понимании. По сути, это просто исполняемый псевдокод! =) Эти примеры должны дать вам общее представлении о том, как работать с PASETO и использовать их в ваших приложениях.

![Python is pseudocode](https://d33wubrfki0l68.cloudfront.net/ada55b711457ae970b8986c7ab32675ff23c46bf/9f022/assets-jekyll/blog/a-thorough-introduction-to-paseto/python-is-pseudocode-9dccb53e766ad76947b2432c1b4626d61f1c8f7f8d43c9d335488c87824551e0.jpg)

## Как использовать локальные PASETO

Для начала давайте посмотрим, как можно создать локальный PASETO. Обратите внимание, что ниже я генерирую секретный ключ, используя _безопасный_ генератор случайных чисел на основе [/dev/urandom](https://unix.stackexchange.com/questions/324209/when-to-use-dev-random-vs-dev-urandom).

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`import json
import secrets
import uuid

import paseto


# Create a secure + random encryption key
key = secrets.token_bytes(32)

# Amount of time (in seconds) this token should be valid for
ttl = 60 * 5

# JSON data to securely transmit
data = {
    'id': str(uuid.uuid4()),
    'name': 'Randall Degges',
    'permissions': [
        'download:file-a.mp4',
        'download:file-b.mp4',
        'download:file-c.mp4'
    ]
}

# Create a new PASETO.
#
# \`token\` can be safely shared in URL params over the internet safely as
# it is a base64 encoded string. The \`token\` value is encrypted.
token = paseto.create(
    key=key,
    purpose='local',
    claims=data,
    footer={
        'kid': '12345'
    },
    exp_seconds=ttl
)

print(f'''
Token Data
~~~~~~~~~~

{json.dumps(data, indent=2)}

PASETO
~~~~~~

{token.decode("utf-8")}
''')`}
</code></pre>

Если вы запустили приведенный выше пример кода, то должны увидеть следующее.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`Token Data
~~~~~~~~~~

{
  "id": "b4c0a96c-554d-4222-ac74-63b97c854b9f",
  "name": "Randall Degges",
  "permissions": [
    "download:file-a.mp4",
    "download:file-b.mp4",
    "download:file-c.mp4"
  ],
  "exp": "2019-10-10T09:08:50-07:00"
}

PASETO
~~~~~~

v2.local.vB7daJlQOL5sY8mQa_FWb6ZYbkNi8yeRqI-DCFNEPTYEu7ItQHMMM5jzD_fw-G7l-AXJRBj3E9jxx9-JS5eG436WGUn03zYp2nuV3PVqppEyRP9LoZ1TTBREhR182NRcNYqUkM8FfazWegWcLc1gSzFXx0Kge4U7XHtAlliTrR8p09hH6qVpqAsgMdp00ao66JX_mxlEjkL3y784CoAK-gyy_ZZ1WzAvYAjQApl859RxnB9uLMpb-VURmetmrw9sC_Iw27to46ulTcMxx_KoSBem9eSG5M4bvNQC5YFeDLIM2HXDf35YIo50.eyJraWQiOiAiMTIzNDUifQ`}
</code></pre>

Строка PASETO в результате содержит данные JSON в зашифрованном виде и будет действительна только в течение 5 минут. Если бы я попытался проверить этот PASETO

через 6 минут после его создания, процесс бы завершился неудачей, поскольку истек срок действия.

Теперь, когда я создал этот PASETO, давайте посмотрим, как его можно расшифровать обратно в исходную форму JSON.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`# Given a PASETO token and the secret key from before, we can decrypt it and
# transform the PASETO string back into a token object
parsed = paseto.parse(
    key=key,
    purpose='local',
    token=token
)

# Convert the token object into a human-friendly form for printing
token_string = json.dumps(parsed['message'], indent=2)

# Display the PASETO token in JSON format
print(f'''
Expanded PASETO
~~~~~~~~~~~~~~~

{token_string}

PASETO Footer
~~~~~~~~~~~~~

{json.dumps(parsed['footer'], indent=2)}
''')`}
</code></pre>

Если вы запустили код выше, то должны увидеть следущее.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`Expanded PASETO
~~~~~~~~~~~~~~~

{
  "id": "a8589a9b-2458-4a45-8bc4-be6db41f3659",
  "name": "Randall Degges",
  "permissions": [
    "download:file-a.mp4",
    "download:file-b.mp4",
    "download:file-c.mp4"
  ],
  "exp": "2019-10-10T09:19:40-07:00"
}

PASETO Footer
~~~~~~~~~~~~~

{
  "kid": "12345"
}`}
</code></pre>

В этом случае расшифровка PASETO сработала отлично, так как использовался правильный секретный ключ , а срок действия еще не истек.

Если вы попытаетесь расшифровать PASETO с истекшим сроком действия , вы получите следующее.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`Traceback (most recent call last):
  File "test.py", line 60, in <module>
    token=token
  File "/home/rdegges/.pyenv/versions/paseto/lib/python3.7/site-packages/paseto.py", line 314, in parse
    raise PasetoTokenExpired('token expired')
paseto.PasetoTokenExpired: token expired`}
</code></pre>

Точно так же, если вы попытаетесь расшифровать PASETO, используя неверный ключ, то получите ошибку.

## Как использовать публичные PASETO

Теперь, когда вы поняли, как работать с локальными PASETO, давайте обратимся к публичным PASETO и работе с ними.

Вот небольшой пример приложения, которое создает пару открытый/закрытый ключ, а затем чеканит новый PASETO с использованием закрытого ключа. Обратите внимание, что пара открытый/закрытый ключ генерируется с использованием [libsodium](https://github.com/stef/pysodium).

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`import json
import secrets
import uuid

import paseto
import pysodium


# Create a secure public/private keypair using libsodium
#
# - \`pk\` is the public key
# - \`sk\` is the secret (private) key
pk, sk = pysodium.crypto_sign_keypair()

# Amount of time (in seconds) this token should be valid for
ttl = 60 * 5

# JSON data to securely transmit
data = {
    'id': str(uuid.uuid4()),
    'name': 'Randall Degges'
}

# Create a new PASETO.
#
# \`token\` can be safely shared in URL params over over the internet safely as
# it is a base64 encoded string. The \`token\` value is NOT encrypted here, but it
# is cryptographically signed.
token = paseto.create(
    key=sk,
    purpose='public',
    claims=data,
    footer={
        'kid': '12345'
    },
    exp_seconds=ttl
)

print(f'''
Token Data
~~~~~~~~~~

{json.dumps(data, indent=2)}

PASETO
~~~~~~

{token.decode("utf-8")}
''')`}
</code></pre>

Если вы запустили эту программу, вы увидите следующее.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`Token Data
~~~~~~~~~~

{
  "id": "410df296-89d5-4380-8423-6f2d73040744",
  "name": "Randall Degges",
  "exp": "2019-10-10T11:03:24-07:00"
}

PASETO
~~~~~~

v2.public.eyJpZCI6ICI0MTBkZjI5Ni04OWQ1LTQzODAtODQyMy02ZjJkNzMwNDA3NDQiLCAibmFtZSI6ICJSYW5kYWxsIERlZ2dlcyIsICJleHAiOiAiMjAxOS0xMC0xMFQxMTowMzoyNC0wNzowMCJ9xe6hZBYn8IZoJmgL9k1VjTcl7Dz4T-lo2FvIxeFXQNtNY3QAyCaa5XW-29n-9nV-beU6z7P-YF97lPFvnPfnDA.eyJraWQiOiAiMTIzNDUifQ`}
</code></pre>

Заметьте, что в этот раз заголовок PASETO - `v2.public`. Это позволяет с легкостью определить тип PASETO, с которым вы работаете.

Теперь, когда вы создали публичный PASETO, как вам проверить данные, которые в нем содержатся? Давайте взглянем!

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`# Given a PASETO token and the public key from before, we can validate that this
# token was generated by the owner of the secret key and that the data it
# contains hasn't been tampered with.
parsed = paseto.parse(
    key=pk,
    purpose='public',
    token=token
)

# Convert the token object into a human-friendly form for printing
token_string = json.dumps(parsed['message'], indent=2)

# Display the PASETO token in JSON format
print(f'''
Expanded PASETO
~~~~~~~~~~~~~~~

{token_string}

PASETO Footer
~~~~~~~~~~~~~

{json.dumps(parsed['footer'], indent=2)}
''')`}
</code></pre>

Если вы запустили эту программу, то увидите следующей вывод.

<pre class="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4 overflow-auto"><code class="">
{`Expanded PASETO
~~~~~~~~~~~~~~~

{
  "id": "c4454652-95a1-4639-804c-2f7615a4c027",
  "name": "Randall Degges",
  "exp": "2019-10-10T11:04:35-07:00"
}

PASETO Footer
~~~~~~~~~~~~~

{
  "kid": "12345"
}`}
</code></pre>

Как видите, создание и проверка публичных PASETO - это несложно.

Главное, что нужно учитывать при работе с публичными PASETO, это то, что все данные, которые вы помещаете в публичные PASETO, будут видны _всем_, включая злоумышленников. Публичные PASETO _не_ зашифрованы, только подписаны.

Из-за этого вам никогда не следует хранить конфиденциальную информацию в PASETO, которую вы не хотели бы видеть на первой странице Reddit. =)

## Чем PASETO лучше, чем веб-токены JSON?

![Confused stick figure](https://d33wubrfki0l68.cloudfront.net/1c85240149888c96e690545205a8a4ee58927982/66829/assets-jekyll/blog/a-thorough-introduction-to-paseto/confused-stick-figure-87540a0dc7b653ca6f9ef09cd20ab0e2d6aa7fe71c23327a015d98e45433401e.jpg)

И тут вы можете задаться вопросом, почему же, если PASETO так похожи на веб-токены JSON (JWT), они вообще существуют?

Как я уже упоминал в начале статьи, PASETO фактически были разработаны для решения различных проблем в спецификации JWT. В частности, сообщества криптографов и безопасности подвергли JWT критике за:

- [Широкое злоупотребление ими](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/) в сферах, которые влияют на веб-безопасность
- Принуждение реализаций [строго придерживаться](https://tools.ietf.org/html/rfc7515#section-4.1.1) заголовка `alg`. Это позволяет злоумышленникам изменить значение `alg` и изменить метод проверки подписи на что-то отличное от того, что было изначально задумано, тем самым создавая реальную возможность подделки токенов.
- Допущение [неправильного выбора криптографии](https://paragonie.com/blog/2017/03/jwt-json-web-tokens-is-bad-standard-that-everyone-should-avoid) в спецификации JSON Web Encryption (JWE), которое позволяет злоумышленникам атаковать зашифрованные токены различными способами.

Подводя итоги, можно сказать, что спецификации JOSE (включающие JWT, JWE, JSON Web Signatures, и т.д.) являются чрезвычайно гибкими спецификациями, которые вынуждают разработчиков создавать множество вариантов низкоуровневой защиты и криптографии, что может вызвать катастрофические проблемы с безопасностью.

Спецификация и реализация PASETO были [разработаны для решения](https://paragonie.com/blog/2018/03/paseto-platform-agnostic-security-tokens-is-secure-alternative-jose-standards-jwt-etc) каждой из этих проблем.

PASETO применяет подход к разработке токенов безопасности, ориентированный в первую очередь на разработчиков , объединяя выбор разработчика с двумя целями: нужна ли вам симметричная или ассиметричная модель безопасности? Исходя из вашего выбора, PASETO подбирает наилучшие возможные варианты для аутентифицированного шифрования и цифровых подписей, чтобы вши токены оставались в безопасности и не подвергались криптографическим уязвимостям.

Спецификация PASETO также четко определяет, как PASETO _следует_ и _не следует_ использовать в целях сокращения злоупотреблений токенами PASETO таким же образом, как люди в настоящее время злоупотребляют JWT.

В общем, я большой поклонник технологии PASETO и вижу большой потенциал в ее внедрении и использовании. В настоящее время в Okta мы работаем над некоторыми проектами, ориентированными на PASETO, которые мы надеемся выпустить в ближайшие месяцы, чтобы сделать технологию PASETO более распространенной. Хотя мы все еще используем в нашем продукте JSON Web Token, мы также работаем над открытыми стандартами, чтобы сделать использование JSON Web Token более безопасным. Наша надежда в том, что решив проблему со всех сторон, мы сможем повысить безопасность токенов в сети для всех.

<blockquote class="mt-6 relative p-4 text-xl italic border-l-4 bg-gray-200 text-gray-600 border-gray-500 quote" title="This article is a translation of 'A Thorough Introduction to PASETO' by Randall Degges">
    {"Данная статья является переводом "}
    <a
        href="https://developer.okta.com/blog/2019/10/17/a-thorough-introduction-to-paseto"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-700 no-underline hover:text-gray-900 hover:underline"
    >
        A Thorough Introduction to PASETO
    </a>
    {", если вы хотите оставить комментарий автору оригинальной статьи, то напишите в "}
    <a
        href="https://twitter.com/oktadev"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-700 no-underline hover:text-gray-900 hover:underline"
    >
    @oktadev
    </a>
    {" или "}
    <a
        href="https://twitter.com/rdegges"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-700 no-underline hover:text-gray-900 hover:underline"
    >
    @rdegges
    </a>
    {". Если у вас есть предложения по переводу, лучшее место для этого напрямую в "}
    <a
        href="https://github.com/JLarky/jlarky/blob/master/posts/a-thorough-introduction-to-paseto.md"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-700 no-underline hover:text-gray-900 hover:underline"
    >
    гитхабе
    </a>
    .
</blockquote>
