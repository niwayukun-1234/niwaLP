document.addEventListener('DOMContentLoaded', () => {
    const TICK_INTERVAL = 6000;
    const MOVE_DURATION = 0.4;

    const rows = document.querySelectorAll('.voice-row');
    const reinitializers = []; // ★追加：bfcache復元時に呼び直す関数を集めておく

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

        // ★追加：初期化（または再初期化）をまとめた関数
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

        // ★追加：この行の再初期化関数を後で呼べるように保存
        reinitializers.push(init);
    });

    // ★追加：bfcacheから復元されたときに、位置とサイズを測り直す
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            reinitializers.forEach(init => init());
        }
    });
});