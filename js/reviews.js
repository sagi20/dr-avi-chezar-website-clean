const reviewsData = [
    // Existing reviews from index.html
    {
        name: "דני",
        text: "הגעתי לד\"ר שזר עם כאבים עזים ומוגבלות בתנועה. לאחר הניתוח חזרתי לתפקוד מלא. היחס היה מדהים והמקצועיות ברמה הגבוהה ביותר.",
        stars: 5,
        category: "ניתוח קרע בגיד"
    },
    {
        name: "שרה",
        text: "רופא בחסד עליון. אבחון מדויק, הסבר מפורט וניתוח מוצלח. תודה על איכות החיים שחזרה אליי.",
        stars: 5,
        category: "החלפת כתף"
    },
    {
        name: "עומר",
        text: "הגעתי עם פריקות חוזרות וחשש גדול. ד\"ר שזר נתן לי ביטחון מהרגע הראשון. היום אני חוזר לספורט מלא.",
        stars: 5,
        category: "ניתוח אי יציבות"
    },
    // New reviews
    {
        name: "יוסי",
        text: "רופא מקצועי, ענייני ומסודר. זמין תמיד – לכל שאלה ששלחתי, קיבלתי תשובה במהירות. השרֵה עליי ביטחון רב לפני הניתוח ובכניסה לחדר הניתוח. גם המשרד מתפקד בצורה מצוינת: זמינים תמיד, ואם לא עונים – חוזרים אליך מיד. לסיכום: תודה רבה לדוקטור אבי שזר על הטיפול המסור והמקצועי.",
        stars: 5,
        category: "כללי"
    },
    {
        name: "רחל",
        text: "הכול מעולה: היחס, המקצועיות, האדיבות. רופא שנותן ביטחון למטופל ואוזן קשבת. ישר כוח!",
        stars: 5,
        category: "כללי"
    },
    {
        name: "ללא שם",
        text: "דוקטור שזר היה אדיב מאוד. הסביר באופן מדויק את התהליך שעברתי, דבר שעודד אותי מאוד וגרם לי להבין עד כמה הוא שולט במלאכתו באופן מצוין.",
        stars: 5,
        category: "כללי"
    },
    {
        name: "גולדה",
        text: "רופא אדיב, מבין ללב הפציינט ובעל סבלנות רבה להסביר מה הולך להיות בטיפול ולאחר מכן מה נעשה בניתוח. ד\"ר שזר אף הגיע לביקור מחוץ לשעות העבודה כדי לוודא שהמצב שלי תקין. תודה גדולה!",
        stars: 5,
        category: "כללי"
    },
    {
        name: "ליאת",
        text: "ד\"ר שזר הוא אדם מדהים ורופא מקצועי מאוד. הוא דואג למטופלים, מסביר את הכול, ומוודא שאין חששות או שאלות. היחס שלו חם ומרגיע, במיוחד ברגעים המלחיצים שלפני כניסה לניתוח. גם לאחר הניתוח הגיע מספר פעמים לבדוק ולוודא שהכול בסדר. לא היו לי שום הפתעות – הוא הכין אותי מראש לכל שלב. הלוואי שרופאים אחרים ילמדו ממנו מה הם יחסי אנוש אמיתיים.",
        stars: 5,
        category: "כללי"
    },
    {
        name: "גבריאל",
        text: "שימשיך כך! רופא ברמה מאוד גבוהה, עם יחס מצוין גם אחרי הניתוח. מאחל לכל חולה שיהיה לו מנתח כזה.",
        stars: 5,
        category: "כללי"
    },
    {
        name: "אילנה",
        text: "הניתוח עבר בהצלחה. אימי מרגישה הרבה יותר טוב לאחר הניתוח; הכאבים פחתו משמעותית לעומת התקופה שלפניו. מודים מאוד לד\"ר שזר על הכול!",
        stars: 5,
        category: "ניתוח"
    },
    {
        name: "אברהם",
        text: "לא נתקלתי בחיי ברופא כל כך טוב, מקצועי ואדיב. הוא מסביר כל דבר – מה היה ומה יהיה אחרי הניתוח. קיבלתי הוראות מדויקות כיצד להתנהג ומה לעשות עד ההחלמה המלאה. הוא גם נתן הנחיות מדויקות לפיזיותרפיסטים, שלב אחרי שלב. ד\"ר אבי שזר – אני שמח שהגעתי אליך, בעקבות ביקורות חיוביות של מטופלים שלך. לד\"ר אבי שזר ולכל הצוות – תודה רבה!",
        stars: 5,
        category: "כללי"
    },
    {
        name: "משה",
        text: "ד\"ר אבי שזר הוא רופא מומחה מצוין. נתן יחס מדהים, הסביר במקצוענות את כל הטיפול שבוצע, וגם אחרי הניתוח עקב אחריי כדי לוודא שהכול תקין. אני ממליץ עליו בחום ומודה לו על היחס המדהים שקיבלתי.",
        stars: 5,
        category: "כללי"
    }
];

function createReviewCard(review) {
    const starsHtml = Array(review.stars).fill('<i data-lucide="star" fill="#FFD700" stroke="none"></i>').join('');

    return `
        <div class="testimonial-card">
            <i data-lucide="quote" class="quote-icon"></i>
            <div class="stars">
                ${starsHtml}
            </div>
            <p>"${review.text}"</p>
            <h4 style="margin-bottom: 0;">${review.name}</h4>
            <span style="font-size: 0.9rem; color: var(--text-muted);">${review.category}</span>
        </div>
    `;
}

function initReviews() {
    const homeGrid = document.querySelector('.testimonials-grid');
    const allReviewsGrid = document.getElementById('allReviewsGrid');

    if (homeGrid && !allReviewsGrid) {
        // Homepage: Show 3 random reviews
        const shuffled = [...reviewsData].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        homeGrid.innerHTML = selected.map(createReviewCard).join('');

        if (window.lucide) {
            window.lucide.createIcons();
        }
    } else if (allReviewsGrid) {
        // Reviews page: Show all reviews
        allReviewsGrid.innerHTML = reviewsData.map(createReviewCard).join('');

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

document.addEventListener('DOMContentLoaded', initReviews);
