document.addEventListener('DOMContentLoaded', () => {
    const sentences = [
        { text: 'My brother ____ ____ games since he was six years old.', blanks: ['has', 'played'] },
        { text: 'My mum ____ ____ in the recruitment and training for six years.', blanks: ['has', 'been'] },
        { text: 'That school ____ ____ there for forty years.', blanks: ['has', 'been'] },
        { text: 'We ____ ____ in this flat since I was a child.', blanks: ['have', 'been'] },
        { text: 'They ____ ____ in New York since 2010.', blanks: ['have', 'lived'] },
        { text: 'She ____ ____ on a new project since last month.', blanks: ['has', 'worked'] },
        { text: 'He ____ ____ his homework yet.', blanks: ['has', 'finished'] },
        { text: 'I ____ ____ this movie twice already.', blanks: ['have', 'seen'] },
        { text: 'We ____ ____ to the gym every day this week.', blanks: ['have', 'gone'] },
        { text: 'The students ____ ____ a lot of progress this semester.', blanks: ['have', 'made'] },
        { text: 'It ____ ____ since this morning.', blanks: ['has', 'rained'] },
        { text: 'You ____ ____ so much since I last saw you!', blanks: ['have', 'grown'] },
        { text: 'I ____ ____ a new phone.', blanks: ['have', 'bought'] },
        { text: 'They ____ ____ in this city for a long time.', blanks: ['have', 'been'] },
        { text: 'She ____ ____ on the phone for an hour.', blanks: ['has', 'talked'] },
        { text: 'My cat ____ ____ on the sofa all day.', blanks: ['has', 'slept'] },
        { text: 'We ____ ____ a lot of work this week.', blanks: ['have', 'done'] },
        { text: 'He ____ ____ his keys.', blanks: ['has', 'lost'] },
        { text: 'I ____ ____ that book.', blanks: ['have', 'read'] },
        { text: 'They ____ ____ to Paris before.', blanks: ['have', 'traveled'] }
    ];

    const allWords = ['has', 'played', 'has', 'been', 'has', 'been', 'have', 'been', 'have', 'lived', 'has', 'worked', 'has', 'finished', 'have', 'seen', 'have', 'gone', 'have', 'made', 'has', 'rained', 'have', 'grown', 'have', 'bought', 'have', 'been', 'has', 'talked', 'has', 'slept', 'have', 'done', 'has', 'lost', 'have', 'read', 'have', 'traveled'];

    const sentencesContainer = document.getElementById('sentences-container');
    const optionsContainer = document.getElementById('options-container');
    const checkButton = document.getElementById('check-button');
    const scoreText = document.getElementById('score-text');

    let currentDrag = null;

    // --- Create Sentences and Blanks ---
    sentences.forEach((sentence, index) => {
        const sentenceDiv = document.createElement('div');
        sentenceDiv.classList.add('sentence');
        
        let textWithBlanks = sentence.text;
        sentence.blanks.forEach((_, blankIndex) => {
            const blankHTML = `<span class="blank" data-sentence-index="${index}" data-blank-index="${blankIndex}"></span>`;
            textWithBlanks = textWithBlanks.replace('____', blankHTML);
        });

        sentenceDiv.innerHTML = textWithBlanks;
        sentencesContainer.appendChild(sentenceDiv);
    });

    // --- Create Draggable Words ---
    allWords.sort(() => Math.random() - 0.5); // Shuffle the words for variety
    allWords.forEach(word => {
        const draggableWord = document.createElement('div');
        draggableWord.classList.add('draggable');
        draggableWord.textContent = word;
        draggableWord.setAttribute('draggable', true);
        optionsContainer.appendChild(draggableWord);

        draggableWord.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            currentDrag = e.target;
            setTimeout(() => e.target.style.opacity = '0.5', 0);
        });

        draggableWord.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    });

    // --- Handle Drop Events on Blanks ---
    const blanks = document.querySelectorAll('.blank');
    blanks.forEach(blank => {
        blank.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        blank.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            const targetBlank = e.target;

            if (targetBlank.textContent.trim() !== '') {
                const oldWord = targetBlank.textContent;
                const oldDraggable = Array.from(optionsContainer.children).find(el => el.textContent === oldWord);
                if (oldDraggable) {
                    oldDraggable.style.display = 'block';
                }
            }

            targetBlank.textContent = data;
            if (currentDrag) {
                currentDrag.style.display = 'none';
            }
        });
    });

    // --- Check Answers and Calculate Score ---
    checkButton.addEventListener('click', () => {
        let score = 0;
        let totalBlanks = 0;
        
        sentences.forEach((sentence, sentenceIndex) => {
            totalBlanks += sentence.blanks.length;
            const sentenceBlanks = document.querySelectorAll(`.sentence:nth-child(${sentenceIndex + 1}) .blank`);

            sentenceBlanks.forEach((blank, blankIndex) => {
                const expectedWord = sentence.blanks[blankIndex];
                const droppedWord = blank.textContent.trim();
                
                if (droppedWord === expectedWord) {
                    blank.classList.remove('incorrect');
                    blank.classList.add('correct');
                    score++;
                } else {
                    blank.classList.remove('correct');
                    blank.classList.add('incorrect');
                }
            });
        });
        
        scoreText.textContent = `Your score: ${score}/${totalBlanks}`;
    });
});