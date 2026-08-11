/* ===================================================================
   ヘッダー：768px以下でのハンバーガーメニュー開閉
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('header-hamburger');
    const nav = document.getElementById('header-nav');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('is-open');
        nav.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // リンクをクリックしたら閉じる（アンカーリンクなので開いたままだと邪魔になる）
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-open');
            nav.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
});

/* ===================================================================
   受講者の声：自動スクロールカルーセル
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const TICK_INTERVAL = 6000;
    const MOVE_DURATION = 0.4;

    const rows = document.querySelectorAll('.voice-row');
    const reinitializers = []; // bfcache復元時に呼び直す関数を集めておく

    rows.forEach((row, rowIndex) => {
        const grid = row.querySelector('.voice-grid');
        if (!grid) return;

        const direction = rowIndex % 2 === 0 ? 'left' : 'right';
        const originalCards = Array.from(grid.children);

        if (direction === 'left') {
            originalCards.forEach(card => {
                grid.appendChild(card.cloneNode(true));
            });
        } else {
            const fragment = document.createDocumentFragment();
            originalCards.forEach(card => {
                fragment.appendChild(card.cloneNode(true));
            });
            grid.insertBefore(fragment, grid.firstChild);
        }

        let step = 0;
        let setWidth = 0;
        let centerOffset = 0;
        let position = 0;

        function measure() {
            const gap = parseFloat(getComputedStyle(grid).gap) || 0;
            const cardWidth = originalCards[0].getBoundingClientRect().width;
            step = cardWidth + gap;
            setWidth = step * originalCards.length;

            const originalBlockWidth = setWidth - gap;
            const rowWidth = row.clientWidth;
            centerOffset = (rowWidth - originalBlockWidth) / 2;
        }

        function updateEdgeStyles() {
            const rowRect = row.getBoundingClientRect();
            const allCards = Array.from(grid.children);

            allCards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const isCutOff =
                    cardRect.left < rowRect.left - 0.5 ||
                    cardRect.right > rowRect.right + 0.5;

                card.classList.toggle('voice-card--edge', isCutOff);
            });
        }

        function setPosition(x, withTransition) {
            grid.style.transitionProperty = 'transform';
            grid.style.transitionDuration = withTransition ? `${MOVE_DURATION}s` : '0s';
            grid.style.transitionTimingFunction = 'ease';
            grid.style.transform = `translateX(${x}px)`;

            if (!withTransition) {
                updateEdgeStyles();
            }
        }

        // 初期化（または再初期化）をまとめた関数
        function init() {
            measure();
            position = direction === 'left' ? centerOffset : centerOffset - setWidth;
            setPosition(position, false);
        }

        init();

        window.addEventListener('resize', () => {
            measure();
            updateEdgeStyles();
        });

        setInterval(() => {
            position += direction === 'left' ? -step : step;
            setPosition(position, true);
        }, TICK_INTERVAL);

        grid.addEventListener('transitionend', () => {
            if (direction === 'left') {
                if (centerOffset - position >= setWidth) {
                    position += setWidth;
                    setPosition(position, false);
                }
            } else {
                if (position - centerOffset >= 0) {
                    position -= setWidth;
                    setPosition(position, false);
                }
            }
            updateEdgeStyles();
        });

        // この行の再初期化関数を後で呼べるように保存
        reinitializers.push(init);
    });

    // bfcacheから復元されたときに、位置とサイズを測り直す
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            reinitializers.forEach(init => init());
        }
    });
});

/* ===================================================================
   日時・料金セクション：無料体験⇔講座の切り替えトグル
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-button');
    const colFree = document.getElementById('date-column-free');
    const colCourse = document.getElementById('date-column-course');
    const priceFree = document.getElementById('price-grid-free');
    const priceCourse = document.getElementById('price-grid-course');

    toggleBtn.addEventListener('click', () => {
        const isCourse = toggleBtn.classList.toggle('is-course');
        colFree.classList.toggle('is-hidden', isCourse);
        colCourse.classList.toggle('is-hidden', !isCourse);
        priceFree.classList.toggle('is-hidden', isCourse);
        priceCourse.classList.toggle('is-hidden', !isCourse);
    });
});

/* ===================================================================
   日時・場所セクション：校舎タブの切り替え
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const schoolData = {
        umeda: {
            address: '〒530-0012<br>大阪府大阪市北区芝田1-4-14 芝田町ビル 5F',
            access: '阪急梅田駅(茶屋町口)より北へ1分 JR大阪駅・地下鉄梅田駅(北口)5番出口北へ3分',
            tel: '06-6292-6355',
            telHours: '電話受付 14:00～20:00',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1639.974832491676!2d135.49582583880334!3d34.706449493229464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e7a7ab62fe59%3A0xaee4acdee271791b!2z6Iqd55Sw55S644OT44Or!5e0!3m2!1sja!2sjp!4v1786257150920!5m2!1sja!2sjp'
        },
        kyodai: {
            address: '〒606-8301<br>京都府京都市左京区吉田泉殿町1-34 ダイショウ百万遍ビル1・2F',
            access: '出町柳駅から徒歩10分（駐輪場あり）',
            tel: '06-6292-6355',
            telHours: '電話受付 14:00～20:00',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.133093239203!2d135.77629267603183!3d35.02840017280505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600109007c1420c5%3A0x9b5f1a14c8480988!2z44OA44Kk44K344On44Km55m-5LiH6YGN44OT44Or!5e0!3m2!1sja!2sjp!4v1786428293762!5m2!1sja!2sjp'
        }
    };

    const schoolTabs = document.querySelectorAll('.date-school button');
    const infoAddress = document.getElementById('info-address');
    const infoAccess = document.getElementById('info-access');
    const infoTel = document.getElementById('info-tel');
    const infoTelHours = document.getElementById('info-tel-hours');
    const mapIframe = document.getElementById('map-iframe');

    schoolTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.school;
            const data = schoolData[key];
            if (!data) return;

            schoolTabs.forEach(t => t.classList.remove('school-tab-active'));
            schoolTabs.forEach(t => t.classList.add('school-tab'));
            tab.classList.remove('school-tab');
            tab.classList.add('school-tab-active');

            infoAddress.innerHTML = data.address;
            infoAccess.textContent = data.access;
            infoTel.textContent = data.tel;
            infoTelHours.textContent = data.telHours;
            mapIframe.src = data.map;
        });
    });
});
/* ===================================================================
   FAQセクション：アコーディオン開閉
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach(card => {
        const question = card.querySelector('.faq-question');
        const answer = card.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');

            // まず全カードを閉じる
            faqCards.forEach(otherCard => {
                otherCard.classList.remove('is-open');
                otherCard.querySelector('.faq-answer').style.maxHeight = null;
            });

            // クリックしたカードが元々閉じてたら、それだけ開く
            if (!isOpen) {
                card.classList.add('is-open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});

/* ===================================================================
   申し込みフォームセクション：無料体験⇔講座タブの切り替え
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const formTabFree = document.getElementById('form-tab-free');
    const formTabCourse = document.getElementById('form-tab-course');
    const courseSelectWrap = document.getElementById('course-select-wrap');
    const courseFixedWrap = document.getElementById('course-fixed-wrap');
    const courseSelect = document.getElementById('course-select');

    formTabFree.addEventListener('click', () => {
        formTabFree.classList.add('active');
        formTabCourse.classList.remove('active');

        courseSelectWrap.classList.remove('is-hidden');
        courseFixedWrap.classList.add('is-hidden');
        courseSelect.required = true;
    });

    formTabCourse.addEventListener('click', () => {
        formTabCourse.classList.add('active');
        formTabFree.classList.remove('active');

        courseSelectWrap.classList.add('is-hidden');
        courseFixedWrap.classList.remove('is-hidden');
        courseSelect.required = false;
    });
});