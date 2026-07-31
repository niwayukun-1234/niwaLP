document.addEventListener('DOMContentLoaded', function () {

    // フォームの「未選択」プルダウンが、ブラウザによって最初の選択肢を
    // 勝手に選んでしまうことがあるため、読み込み時に明示的にリセットする
    document.querySelectorAll('.apply-form-box select[required]').forEach(function (sel) {
        if (sel.id !== 'course-name-input') {
            sel.selectedIndex = 0;
        }
    });

    // よくある質問：同時に2つ以上開かない（開いたら他は閉じる）
    document.querySelectorAll('.faq-item').forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (item.open) {
                document.querySelectorAll('.faq-item').forEach(function (other) {
                    if (other !== item) {
                        other.open = false;
                    }
                });
            }
        });
    });

    // ヘッダー・本文中のCTAボタン → 申し込みフォームまでスクロール
    document.querySelectorAll('.js-scroll-form').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector('#form');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ヘッダーナビ（受講成果・講座内容・受講者の声・日時・料金・よくある質問）
    // → クリックした項目に対応するセクションまでスクロール
    document.querySelectorAll('.js-nav').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var target = document.querySelector(targetId);
            if (target) {
                var headerOffset = 120; // 固定ヘッダー分のオフセット
                var elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                var offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 日程・場所セクション：無料体験 / 講座の切り替え（料金表示も連動）
    document.querySelectorAll('.js-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.js-toggle').forEach(function (b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            var isLecture = this.dataset.target === 'course-lecture';
            var priceExperience = document.querySelector('.price-grid[data-price-group="experience"]');
            var priceLecture = document.querySelector('.price-grid[data-price-group="lecture"]');
            if (priceExperience && priceLecture) {
                priceExperience.hidden = isLecture;
                priceLecture.hidden = !isLecture;
            }

            var datesExperience = document.querySelector('.date-cols[data-schedule-group="experience"]');
            var datesLecture = document.querySelector('.date-cols[data-schedule-group="lecture"]');
            if (datesExperience && datesLecture) {
                datesExperience.hidden = isLecture;
                datesLecture.hidden = !isLecture;
            }
        });
    });

    // 日程・場所セクション：校舎タブの切り替え（住所・アクセス・地図も連動）
    var schoolData = {
        umeda: {
            address: '〒530-0012<br>大阪府大阪市北区芝田1-4-14 芝田町ビル 5F',
            access: '阪急梅田駅（茶屋町口）より北へ1分 JR大阪駅・地下鉄梅田駅（北口）5番出口北へ3分',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.951131182369!2d135.49252504398652!3d34.70641251326531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e7bade6f89df%3A0x8766069fb44a5918!2zQmVFbmdpbmVlciDmooXnlLDmoKEg5Lit6auY55Sf44Gu44Gf44KB44Gu44OX44Ot44Kw44Op44Of44Oz44Kw5pWZ5a6k!5e0!3m2!1sja!2sjp!4v1765620343747!5m2!1sja!2sjp'
        },
        kyodai: {
            address: '〒606-8301<br>京都府京都市左京区吉田泉殿町1-34<br>ダイショウ百万遍ビル1・2F',
            access: '出町柳駅から徒歩10分（駐輪場あり）',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.1333250670086!2d135.77621201126811!3d35.02839437269156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600109202dca3be5%3A0x47f35e4463f2494d!2zQmVFbmdpbmVlci!5e0!3m2!1sja!2sjp!4v1765620304307!5m2!1sja!2sjp'
        },
        iidabashi: {
            address: '〒102-0071<br>東京都千代田区富士見2-12-13<br>フィル・パーク Kagulab.IIDABASHI',
            access: '飯田橋駅（メトロ・JR）から徒歩5分',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.1166738270394!2d139.74175991129826!3d35.69874637246727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d0049fe7617%3A0xabc5a8acb84acc89!2zQmVFbmdpbmVlciDmnbHkuqzpo6_nlLDmqYvmoKEg5Lit6auY55Sf44Gu44Gf44KB44Gu44OX44Ot44Kw44Op44Of44Oz44Kw5pWZ5a6k!5e0!3m2!1sja!2sjp!4v1765620367911!5m2!1sja!2sjp'
        },
        yokohama: {
            address: '〒220-0012<br>神奈川県横浜市西区みなとみらい2-2-1<br>横浜ランドマークタワー14F',
            access: 'みなとみらい駅から徒歩2分<br>桜木町駅から徒歩5分',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.99984077091!2d139.6282889112873!3d35.45479837254715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185d0050093495%3A0x8a32f66ecd6ef33c!2zQmVFbmdpbmVlciDmqKrmtZzmoKEg5Lit6auY55Sf44Gu44Gf44KB44Gu44OX44Ot44Kw44Op44Of44Oz44Kw5pWZ5a6k!5e0!3m2!1sja!2sjp!4v1765620399172!5m2!1sja!2sjp'
        },
        shuri: {
            address: '〒903-0806<br>沖縄県那覇市首里汀良町1-27',
            access: 'ゆいレール首里駅 徒歩3分',
            map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.3299658128526!2d127.72102527589043!3d26.21846607706778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56bff591e2409%3A0x38f9f76599ff3cbc!2z5YCL5Yil5oyH5bCOQXhpcyDpppbph4zmoKE!5e0!3m2!1sja!2sjp!4v1776436873264!5m2!1sja!2sjp'
        }
    };

    var scheduleAddress = document.querySelector('#schedule-address');
    var scheduleAccess = document.querySelector('#schedule-access');
    var scheduleMap = document.querySelector('#schedule-map');
    var venueSelect = document.querySelector('select[name="venue"]');

    function applySchool(schoolKey, syncForm) {
        document.querySelectorAll('.js-school').forEach(function (b) {
            b.classList.toggle('active', b.dataset.school === schoolKey);
        });

        var data = schoolData[schoolKey];
        if (data) {
            if (scheduleAddress) scheduleAddress.innerHTML = data.address;
            if (scheduleAccess) scheduleAccess.innerHTML = data.access;
            if (scheduleMap) scheduleMap.src = data.map;
        }

        // フォーム側の「開催場所」プルダウンは、実際に校舎タブをクリックしたときだけ連動させる
        // （ページ読み込み時は「未選択」のままにしておく）
        if (syncForm && venueSelect) {
            venueSelect.value = schoolKey;
        }
    }

    document.querySelectorAll('.js-school').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applySchool(this.dataset.school, true);
        });
    });

    // 初期表示：デフォルトでアクティブな「梅田校」に合わせて
    // 住所・アクセス・地図だけ揃えておく（フォームの開催場所は未選択のまま）
    applySchool('umeda', false);

    // 申し込みフォーム：無料体験 / 講座タブの切り替え
    var courseNameSelect = document.querySelector('#course-name-input');
    var lectureOptionsHTML = '<option value="python-master" selected>Pythonマスター講座</option>';
    var experienceOptionsHTML =
        '<option value="" selected disabled>未選択</option>' +
        '<option value="vibe-coding">バイブコーディング</option>' +
        '<option value="webpage-dev">webページ開発体験</option>';

    document.querySelectorAll('.js-form-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.js-form-toggle').forEach(function (b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // 「講座」タブ：講座名は「Pythonマスター講座」に固定（選べないようにする）
            // 「無料体験」タブ：バイブコーディング / webページ開発体験 から選択（未選択がデフォルト）
            if (courseNameSelect) {
                if (this.dataset.target === 'lecture') {
                    courseNameSelect.innerHTML = lectureOptionsHTML;
                    courseNameSelect.classList.add('is-fixed');
                } else {
                    courseNameSelect.innerHTML = experienceOptionsHTML;
                    courseNameSelect.classList.remove('is-fixed');
                }
            }
        });
    });

    // 申し込みフォームの送信（デモ用：実際の送信処理は別途実装してください）
    var applyForm = document.querySelector('.apply-form-box');
    if (applyForm) {
        applyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = applyForm.querySelector('input[name="name"]').value;
            alert(name + ' 様\nお申し込みありがとうございます。');
        });
    }

    // ============================================================
    // 受講後の成果：生徒の声 / 保護者の声 の自動カルーセル
    // ・2秒静止 → スライド → 中央2枚を影で強調 → また2秒静止 …をループ
    // ・data-carousel-direction="left" は左方向、"right" は右方向に流れる
    // ============================================================
    function initVoiceCarousel(wrap, direction) {
        var track = wrap.querySelector('.voice-row');
        if (!track) return;

        var originalCards = Array.prototype.slice.call(track.children);
        var count = originalCards.length;
        if (count === 0) return;

        // 前後にカードを複製し、継ぎ目が見えない無限ループを作る
        var prependFrag = document.createDocumentFragment();
        var appendFrag = document.createDocumentFragment();
        originalCards.forEach(function (card) {
            var cloneBefore = card.cloneNode(true);
            cloneBefore.setAttribute('aria-hidden', 'true');
            prependFrag.appendChild(cloneBefore);

            var cloneAfter = card.cloneNode(true);
            cloneAfter.setAttribute('aria-hidden', 'true');
            appendFrag.appendChild(cloneAfter);
        });
        track.insertBefore(prependFrag, track.firstChild);
        track.appendChild(appendFrag);

        var step = direction === 'right' ? -1 : 1; // right = 逆方向（右へ流れる）
        var index = count; // 中央（本物のカード群）から開始
        var cardWidth = 0;

        function measure() {
            var firstCard = track.children[0];
            var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24);
            cardWidth = firstCard.getBoundingClientRect().width + gap;
        }

        function applyTransform(withTransition) {
            track.style.transition = withTransition ? '' : 'none';
            track.style.transform = 'translateX(' + (-index * cardWidth) + 'px)';
        }

        function updateActiveCards() {
            var wrapRect = wrap.getBoundingClientRect();
            var wrapCenter = wrapRect.left + wrapRect.width / 2;

            var distances = Array.prototype.map.call(track.children, function (card) {
                var rect = card.getBoundingClientRect();
                var cardCenter = rect.left + rect.width / 2;
                return { card: card, distance: Math.abs(cardCenter - wrapCenter) };
            });

            distances.sort(function (a, b) { return a.distance - b.distance; });

            distances.forEach(function (item, i) {
                item.card.classList.toggle('is-active', i < 2); // 中央に最も近い2枚を強調
            });
        }

        function loop() {
            setTimeout(function () {
                index += step;
                applyTransform(true);

                setTimeout(function () {
                    // ループの継ぎ目に達したら、見た目を変えずに位置を巻き戻す
                    if (step === 1 && index >= count * 2) {
                        index -= count;
                        applyTransform(false);
                    } else if (step === -1 && index <= 0) {
                        index += count;
                        applyTransform(false);
                    }
                    updateActiveCards();
                    loop();
                }, 700); // スライドにかかる時間（CSSのtransitionと合わせる）
            }, 2000); // 静止している時間
        }

        measure();
        applyTransform(false);
        updateActiveCards();
        window.addEventListener('resize', function () {
            measure();
            applyTransform(false);
            updateActiveCards();
        });

        loop();
    }

    document.querySelectorAll('.voice-row-wrap').forEach(function (wrap) {
        var direction = wrap.dataset.carouselDirection || 'left';
        initVoiceCarousel(wrap, direction);
    });

});