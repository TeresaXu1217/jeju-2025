<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#F5F4F0" />
    <meta name="description" content="Jeju Trip 2025" />
    <title>Jeju Trip 2025</title>
    
    <!-- 1. 強制載入 Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- 2. 設定您的專屬字體與顏色 -->
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              wine: '#86473F',   /* 酒紅 */
              coffee: '#B35C37', /* 深咖 */
              bg: '#F5F4F0',     /* 米白背景 */
              text: '#333333'    /* 深灰文字 */
            },
            fontFamily: {
              // 英文主要字體
              sans: ['Montserrat', 'sans-serif'], 
              // 中文大標 (使用繁體襯線體以避免缺字，效果與簡體版相同)
              serif: ['Noto Serif TC', 'serif'],  
              // 內文細體
              body: ['Zen Kaku Gothic New', 'sans-serif'], 
            }
          }
        }
      }
    </script>

    <!-- 3. 載入 Google Fonts (Montserrat, Noto Serif TC, Zen Kaku Gothic New) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Noto+Serif+TC:wght@400;700&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
