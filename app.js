const sampleSigns = {
  hello: { emoji: "👋", category: "Greetings" },
  hi: { emoji: "👋", category: "Greetings" },
  thank: { emoji: "🙏", category: "Greetings" },
  thanks: { emoji: "🙏", category: "Greetings" },
  thankyou: { emoji: "🙏", category: "Greetings" },
  water: { emoji: "💧", category: "Everyday words" },
  help: { emoji: "🆘", category: "Everyday words" },
  food: { emoji: "🍽️", category: "Everyday words" },
  mother: { emoji: "👩", category: "People & family" },
  family: { emoji: "👨‍👩‍👧", category: "People & family" },
  one: { emoji: "☝️", category: "Numbers" },
  two: { emoji: "✌️", category: "Numbers" }
};

const messageInput = document.getElementById("messageInput");
const signResults = document.getElementById("signResults");
const speechLanguage = document.getElementById("speechLanguage");

function showSigns() {
  const words = messageInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  signResults.innerHTML = "";

  if (!words.length) {
    signResults.innerHTML = '<p class="empty-message">Please type a message first.</p>';
    return;
  }

  words.forEach((word) => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    const sign = sampleSigns[cleanWord];
    const tile = document.createElement("article");
    tile.className = "sign-tile";

    const symbol = document.createElement("div");
    symbol.className = "tile-symbol";
    symbol.textContent = sign ? sign.emoji : "🔤";

    const title = document.createElement("strong");
    title.textContent = word;

    const note = document.createElement("small");
    note.textContent = sign ? `Sample · ${sign.category}` : "Not in demo library";

    tile.append(symbol, title, note);
    signResults.appendChild(tile);
  });
}

function speakMessage() {
  const text = messageInput.value.trim();
  if (!text) {
    alert("Please type a message first.");
    return;
  }
  if (!("speechSynthesis" in window)) {
    alert("Speech output is not supported in this browser. Please try a recent version of Chrome.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLanguage.value;
  window.speechSynthesis.speak(utterance);
}

document.getElementById("showSigns").addEventListener("click", showSigns);
document.getElementById("speakMessage").addEventListener("click", speakMessage);

document.querySelectorAll(".lesson-card").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    document.getElementById("lessonMessage").textContent =
      `${category} selected! Next, we'll add verified sign media, flashcards, and a quiz for this category.`;
  });
});

document.getElementById("languageToggle").addEventListener("click", () => {
  const select = speechLanguage;
  select.value = select.value === "en-IN" ? "hi-IN" : "en-IN";
  document.getElementById("languageToggle").textContent =
    select.value === "en-IN" ? "Language: English" : "Language: Hindi";
});

showSigns();
// =====================================
// SIGNBRIDGE BACKEND CONNECTION
// =====================================

const API_URL = "http://localhost:3000/api";

// =====================================
// INTERACTIVE LEARNING CATEGORIES
// =====================================

async function loadCategoriesFromBackend() {
    const lessonGrid = document.getElementById("lessonGrid");
    const lessonMessage = document.getElementById("lessonMessage");

    if (!lessonGrid) {
        console.error("Learning categories container not found.");
        return;
    }

    // Learning content for each category
    const lessons = {
        "Greetings": {
            emoji: "👋",
            subtitle: "Hello, goodbye, thank you",
            description: "Learn common greetings and polite expressions.",
            words: [
                { word: "Hello", meaning: "A greeting" },
                { word: "Goodbye", meaning: "Saying farewell" },
                { word: "Thank you", meaning: "Showing gratitude" },
                { word: "Please", meaning: "Making a polite request" }
            ],
            practice: "Hello! How are you?"
        },

        "Everyday Needs": {
            emoji: "💧",
            subtitle: "Water, food, home, help",
            description: "Explore words used to express everyday needs.",
            words: [
                { word: "Water", meaning: "Something we drink" },
                { word: "Food", meaning: "Something we eat" },
                { word: "Home", meaning: "The place where we live" },
                { word: "Help", meaning: "Assistance when needed" }
            ],
            practice: "I need water, please."
        },

        "Everyday words": {
            emoji: "💧",
            subtitle: "Water, food, home, help",
            description: "Explore words used to express everyday needs.",
            words: [
                { word: "Water", meaning: "Something we drink" },
                { word: "Food", meaning: "Something we eat" },
                { word: "Home", meaning: "The place where we live" },
                { word: "Help", meaning: "Assistance when needed" }
            ],
            practice: "I need help, please."
        },

        "People and Family": {
            emoji: "👨‍👩‍👧",
            subtitle: "Family and people around us",
            description: "Learn words for people and family members.",
            words: [
                { word: "Family", meaning: "People connected as a family" },
                { word: "Mother", meaning: "A female parent" },
                { word: "Father", meaning: "A male parent" },
                { word: "Friend", meaning: "Someone you know and trust" }
            ],
            practice: "This is my family."
        },

        "People & family": {
            emoji: "👨‍👩‍👧",
            subtitle: "Family and people around us",
            description: "Learn words for people and family members.",
            words: [
                { word: "Family", meaning: "People connected as a family" },
                { word: "Mother", meaning: "A female parent" },
                { word: "Father", meaning: "A male parent" },
                { word: "Friend", meaning: "Someone you know and trust" }
            ],
            practice: "This is my family."
        },

        "Numbers": {
            emoji: "🔢",
            subtitle: "Start counting step by step",
            description: "Practise recognising numbers and counting.",
            words: [
                { word: "One", meaning: "Number 1" },
                { word: "Two", meaning: "Number 2" },
                { word: "Three", meaning: "Number 3" },
                { word: "Four", meaning: "Number 4" }
            ],
            practice: "I have two books."
        },

        "Healthcare": {
            emoji: "🏥",
            subtitle: "Doctor, hospital, essential needs",
            description: "Learn useful words for healthcare situations.",
            words: [
                { word: "Doctor", meaning: "A medical professional" },
                { word: "Hospital", meaning: "A place for medical care" },
                { word: "Medicine", meaning: "A substance used for treatment" },
                { word: "Emergency", meaning: "A situation requiring urgent help" }
            ],
            practice: "I need a doctor, please."
        }
    };

    try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error("Failed to load learning categories.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.categories)) {
            throw new Error("Invalid categories response.");
        }

        lessonGrid.innerHTML = "";

        // Create the lesson panel
        let lessonPanel = document.getElementById("lessonDetailsPanel");

        if (!lessonPanel) {
            lessonPanel = document.createElement("div");
            lessonPanel.id = "lessonDetailsPanel";
            lessonPanel.className = "lesson-details-panel";
            lessonPanel.hidden = true;
            lessonGrid.insertAdjacentElement("afterend", lessonPanel);
        }

        // Display every category
        data.categories.forEach((category) => {
            const lesson = lessons[category.name] || {
                emoji: "📘",
                subtitle: category.description || "Explore this category.",
                description: category.description || "Explore this learning category.",
                words: [
                    { word: "Learn", meaning: "Explore new knowledge." },
                    { word: "Practise", meaning: "Improve through practice." }
                ],
                practice: "I want to learn."
            };

            const card = document.createElement("button");
            card.type = "button";
            card.className = "lesson-card";
            card.dataset.category = category.name;
            card.setAttribute("aria-pressed", "false");

            const emoji = document.createElement("span");
            emoji.className = "lesson-emoji";
            emoji.textContent = lesson.emoji;

            const title = document.createElement("span");
            title.className = "lesson-title";
            title.textContent = category.name;

            const subtitle = document.createElement("span");
            subtitle.className = "lesson-subtitle";
            subtitle.textContent = lesson.subtitle;

            const arrow = document.createElement("span");
            arrow.className = "lesson-arrow";
            arrow.textContent = "Explore →";

            card.append(emoji, title, subtitle, arrow);

            card.addEventListener("click", () => {
                // Highlight the selected category
                lessonGrid.querySelectorAll(".lesson-card").forEach((otherCard) => {
                    otherCard.setAttribute("aria-pressed", "false");
                });

                card.setAttribute("aria-pressed", "true");

                // Build the selected lesson
                lessonPanel.innerHTML = "";

                const heading = document.createElement("h3");
                heading.textContent = `${lesson.emoji} ${category.name} Lesson`;

                const description = document.createElement("p");
                description.textContent = lesson.description;

                const vocabularyHeading = document.createElement("h4");
                vocabularyHeading.textContent = "Explore Vocabulary";

                const vocabularyGrid = document.createElement("div");
                vocabularyGrid.className = "lesson-vocabulary-grid";

                lesson.words.forEach((item) => {
                    const wordButton = document.createElement("button");
                    wordButton.type = "button";
                    wordButton.className = "lesson-word-button";

                    const wordTitle = document.createElement("strong");
                    wordTitle.textContent = item.word;

                    const wordMeaning = document.createElement("span");
                    wordMeaning.textContent = item.meaning;

                    wordButton.append(wordTitle, wordMeaning);

                    wordButton.addEventListener("click", () => {
                        const messageInput = document.getElementById("messageInput");

                        if (messageInput) {
                            messageInput.value = item.word;
                            messageInput.dispatchEvent(
                                new Event("input", { bubbles: true })
                            );
                            messageInput.focus();
                        }

                        const status = lessonPanel.querySelector(".lesson-status");

                        if (status) {
                            status.textContent =
                                `"${item.word}" selected. You can use it in your message.`;
                        }
                    });

                    vocabularyGrid.appendChild(wordButton);
                });

                // Practice sentence
                const practiceHeading = document.createElement("h4");
                practiceHeading.textContent = "Practice a Sentence";

                const practiceSentence = document.createElement("p");
                practiceSentence.className = "lesson-practice-sentence";
                practiceSentence.textContent = lesson.practice;

                const useSentenceButton = document.createElement("button");
                useSentenceButton.type = "button";
                useSentenceButton.className = "lesson-practice-button";
                useSentenceButton.textContent = "Use This Sentence";

                useSentenceButton.addEventListener("click", () => {
                    const messageInput = document.getElementById("messageInput");

                    if (messageInput) {
                        messageInput.value = lesson.practice;
                        messageInput.dispatchEvent(
                            new Event("input", { bubbles: true })
                        );
                        messageInput.focus();
                    }

                    const status = lessonPanel.querySelector(".lesson-status");

                    if (status) {
                        status.textContent = "Practice sentence added to your message.";
                    }
                });

                const status = document.createElement("p");
                status.className = "lesson-status";
                status.setAttribute("aria-live", "polite");
                status.textContent = "Choose a word or practise the sentence.";

                // ISL learning reminder
                const note = document.createElement("p");
                note.className = "lesson-learning-note";
                note.textContent =
                    "These are English vocabulary and practice activities, not verified ISL signs. " +
                    "Use the ISL Resources section for sign-language demonstrations.";

                lessonPanel.append(
                    heading,
                    description,
                    vocabularyHeading,
                    vocabularyGrid,
                    practiceHeading,
                    practiceSentence,
                    useSentenceButton,
                    status,
                    note
                );

                lessonPanel.hidden = false;
                lessonPanel.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "auto"
                        : "smooth",
                    block: "nearest"
                });
            });

            lessonGrid.appendChild(card);
        });

        if (lessonMessage) {
            lessonMessage.textContent =
                "Choose any category to explore its vocabulary and practise a sentence.";
        }

        console.log("Interactive learning categories loaded successfully.");

    } catch (error) {
        console.error("Learning categories error:", error);

        lessonGrid.textContent =
            "Learning categories could not be loaded. Please check the backend and refresh.";
    }
}
// =====================================
// LOAD INTERACTIVE QUICK MESSAGES
// =====================================

async function loadQuickMessagesFromBackend() {
    const container = document.getElementById(
        "quickMessagesContainer"
    );

    if (!container) {
        console.error("Quick messages container not found.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/quick-messages`
        );

        if (!response.ok) {
            throw new Error("Could not load quick messages.");
        }

        const data = await response.json();

        if (!data.success || !data.messages.length) {
            container.textContent = "No quick messages available.";
            return;
        }

        container.innerHTML = "";

        data.messages.forEach((message) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "quick-message-btn";
            button.textContent = message.text;

            button.addEventListener("click", () => {
                messageInput.value = message.text;

                // Refresh the sample vocabulary results
                showSigns();

                // Announce the selected message to assistive technology
                container.setAttribute("aria-live", "polite");
                button.setAttribute("aria-pressed", "true");

                // Reset the selected state on other buttons
                container.querySelectorAll("button").forEach((otherButton) => {
                    if (otherButton !== button) {
                        otherButton.setAttribute("aria-pressed", "false");
                    }
                });
            });

            button.setAttribute("aria-pressed", "false");

            container.appendChild(button);
        });

        console.log("Quick messages displayed successfully.");

    } catch (error) {
        console.error("Quick messages error:", error);
        container.textContent =
            "Quick messages could not be loaded. Please try refreshing.";
    }
}

// Run both functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadCategoriesFromBackend();
    loadQuickMessagesFromBackend();
});
// =====================================
// SIGNBRIDGE SPEECH-TO-TEXT
// =====================================

(function setupSpeechRecognition() {

    const speechBtn = document.getElementById("speechBtn");
    const messageBox = document.getElementById("messageInput");

    if (!speechBtn || !messageBox) {
        console.error("Speech button or message box not found.");
        return;
    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        speechBtn.addEventListener("click", () => {
            alert(
                "Speech recognition is not supported in this browser. Please try Google Chrome."
            );
        });
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    speechBtn.addEventListener("click", () => {
        speechBtn.textContent = "Listening... Speak now";
        speechBtn.disabled = true;

        try {
            recognition.start();
        } catch (error) {
            console.error("Speech recognition could not start:", error);
            speechBtn.disabled = false;
            speechBtn.textContent = "🎤 Speak Message";
        }
    });

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;

        messageBox.value = spokenText;

        // Update the sample sign results using the new message
        showSigns();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === "not-allowed") {
            alert("Please allow microphone access in your browser.");
        } else if (event.error === "no-speech") {
            alert("No speech detected. Please try speaking again.");
        } else {
            alert("Speech recognition error: " + event.error);
        }
    };

    recognition.onend = () => {
        speechBtn.disabled = false;
        speechBtn.textContent = "🎤 Speak Message";
    };

    console.log("SignBridge speech-to-text initialized.");

})();
// =====================================
// SIGNBRIDGE INTERACTIVE LEARNING QUIZ
// =====================================

const quizQuestions = [
    {
        question: "What is a respectful way to get someone's attention?",
        options: [
            "Shout loudly at them",
            "Gently wave or tap their shoulder when appropriate",
            "Ignore them",
            "Walk away without communicating"
        ],
        answer: 1,
        explanation:
            "A gentle wave or an appropriate shoulder tap can help get someone's attention respectfully."
    },
    {
        question: "What should you do if you do not understand someone's message?",
        options: [
            "Guess the meaning",
            "Ignore the person",
            "Politely ask them to repeat or clarify",
            "End the conversation immediately"
        ],
        answer: 2,
        explanation:
            "Politely asking for clarification helps both people understand each other."
    },
    {
        question: "Which action can help communication with a deaf person?",
        options: [
            "Face the person while communicating",
            "Always speak while facing away",
            "Cover your mouth",
            "Avoid using visual communication"
        ],
        answer: 0,
        explanation:
            "Facing the person can support visual communication and may help with lip-reading when used."
    },
    {
        question: "What should you do before helping someone who may need assistance?",
        options: [
            "Assume what they need",
            "Take control without asking",
            "Ask how you can help",
            "Walk away immediately"
        ],
        answer: 2,
        explanation:
            "Asking first respects the person's choices and individual needs."
    },
    {
        question: "Why is learning sign language useful?",
        options: [
            "It replaces every other form of communication",
            "It helps people communicate through a visual language",
            "It is only useful for children",
            "It prevents people from speaking"
        ],
        answer: 1,
        explanation:
            "Sign languages are complete natural languages that enable communication through visual and manual expression."
    }
];

let currentQuestionIndex = 0;
let quizCorrectAnswers = 0;
let quizAnswered = false;

const quizQuestionElement = document.getElementById("quizQuestion");
const quizOptionsElement = document.getElementById("quizOptions");
const questionNumberElement = document.getElementById("questionNumber");
const quizScoreElement = document.getElementById("quizScore");
const quizFeedbackElement = document.getElementById("quizFeedback");
const quizProgressBar = document.getElementById("quizProgressBar");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const quizResultElement = document.getElementById("quizResult");

function loadQuizQuestion() {
    const question = quizQuestions[currentQuestionIndex];

    quizAnswered = false;

    questionNumberElement.textContent =
        `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    quizScoreElement.textContent = `Score: ${quizCorrectAnswers}`;

    quizQuestionElement.textContent = question.question;

    quizFeedbackElement.textContent = "";

    quizOptionsElement.innerHTML = "";

    nextQuestionBtn.hidden = true;
    restartQuizBtn.hidden = true;
    quizResultElement.hidden = true;

    quizProgressBar.style.width =
        `${(currentQuestionIndex / quizQuestions.length) * 100}%`;

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        button.addEventListener("click", () => {
            checkQuizAnswer(index, button);
        });

        quizOptionsElement.appendChild(button);
    });
}

function checkQuizAnswer(selectedIndex, selectedButton) {
    if (quizAnswered) {
        return;
    }

    quizAnswered = true;

    const question = quizQuestions[currentQuestionIndex];
    const optionButtons = quizOptionsElement.querySelectorAll(".quiz-option");

    optionButtons.forEach((button) => {
        button.disabled = true;
    });

    if (selectedIndex === question.answer) {
        quizCorrectAnswers++;

        selectedButton.classList.add("correct");

        quizFeedbackElement.textContent =
            `Correct! ${question.explanation}`;
    } else {
        selectedButton.classList.add("incorrect");

        optionButtons[question.answer].classList.add("correct");

        quizFeedbackElement.textContent =
            `Not quite. The correct answer is ` +
            `${String.fromCharCode(65 + question.answer)}. ` +
            `${question.explanation}`;
    }

    quizScoreElement.textContent = `Score: ${quizCorrectAnswers}`;

    quizProgressBar.style.width =
        `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;

    if (currentQuestionIndex < quizQuestions.length - 1) {
        nextQuestionBtn.hidden = false;
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    const percentage = Math.round(
        (quizCorrectAnswers / quizQuestions.length) * 100
    );

    quizResultElement.hidden = false;

    quizResultElement.textContent =
        `Quiz Completed! You scored ${quizCorrectAnswers} out of ` +
        `${quizQuestions.length} (${percentage}%). ` +
        (percentage === 100
            ? "Excellent work!"
            : percentage >= 60
                ? "Good job! Keep learning."
                : "Keep practising. You can improve with every attempt!");

    restartQuizBtn.hidden = false;
}

nextQuestionBtn.addEventListener("click", () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuizQuestion();
    }
});

restartQuizBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    quizCorrectAnswers = 0;
    loadQuizQuestion();
});

loadQuizQuestion();
// =====================================
// SIGNBRIDGE VOCABULARY EXPLORER
// =====================================

const vocabularyItems = [
    {
        word: "Hello",
        category: "Greetings",
        meaning: "A friendly greeting used when meeting someone."
    },
    {
        word: "Goodbye",
        category: "Greetings",
        meaning: "A word used when leaving someone."
    },
    {
        word: "Thank You",
        category: "Greetings",
        meaning: "An expression used to show gratitude."
    },
    {
        word: "Please",
        category: "Everyday Needs",
        meaning: "A polite word used when making a request."
    },
    {
        word: "Water",
        category: "Everyday Needs",
        meaning: "A basic need for drinking and staying hydrated."
    },
    {
        word: "Food",
        category: "Everyday Needs",
        meaning: "Something people eat for nourishment."
    },
    {
        word: "Help",
        category: "Everyday Needs",
        meaning: "Assistance requested when support is needed."
    },
    {
        word: "Family",
        category: "People and Family",
        meaning: "People connected through family relationships."
    },
    {
        word: "Friend",
        category: "People and Family",
        meaning: "A person with whom someone shares friendship."
    },
    {
        word: "One",
        category: "Numbers",
        meaning: "The number that comes before two."
    },
    {
        word: "Two",
        category: "Numbers",
        meaning: "The number that comes after one."
    },
    {
        word: "Doctor",
        category: "Healthcare",
        meaning: "A qualified medical professional who provides healthcare."
    },
    {
        word: "Hospital",
        category: "Healthcare",
        meaning: "A healthcare facility where people receive medical care."
    }
];

const vocabularySearch = document.getElementById("vocabularySearch");
const vocabularyCategory = document.getElementById("vocabularyCategory");
const vocabularyGrid = document.getElementById("vocabularyGrid");
const vocabularyCount = document.getElementById("vocabularyCount");

const vocabularyDetails = document.getElementById("vocabularyDetails");
const vocabularyWord = document.getElementById("vocabularyWord");
const vocabularyMeaning = document.getElementById("vocabularyMeaning");
const vocabularyWordCategory =
    document.getElementById("vocabularyWordCategory");

const speakVocabularyBtn =
    document.getElementById("speakVocabularyBtn");

let selectedVocabularyWord = null;

function renderVocabulary() {
    if (!vocabularyGrid) return;

    const searchText = vocabularySearch.value.trim().toLowerCase();
    const selectedCategory = vocabularyCategory.value;

    const filteredItems = vocabularyItems.filter((item) => {
        const matchesSearch =
            item.word.toLowerCase().includes(searchText) ||
            item.meaning.toLowerCase().includes(searchText) ||
            item.category.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    vocabularyGrid.innerHTML = "";

    vocabularyCount.textContent =
        `${filteredItems.length} vocabulary word${filteredItems.length === 1 ? "" : "s"} found`;

    if (selectedVocabularyWord &&
        !filteredItems.includes(selectedVocabularyWord)) {
        selectedVocabularyWord = null;
        vocabularyDetails.hidden = true;
    }

    if (filteredItems.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "vocabulary-empty";
        emptyMessage.textContent =
            "No matching words found. Try another search.";
        vocabularyGrid.appendChild(emptyMessage);
        return;
    }

    filteredItems.forEach((item) => {
        const card = document.createElement("button");

        card.type = "button";
        card.className = "vocabulary-card";
        card.setAttribute("aria-pressed", "false");

        const title = document.createElement("h3");
        title.textContent = item.word;

        const meaning = document.createElement("p");
        meaning.textContent = item.meaning;

        const category = document.createElement("span");
        category.textContent = item.category;

        card.append(title, meaning, category);

        card.addEventListener("click", () => {
            selectedVocabularyWord = item;

            vocabularyWord.textContent = item.word;
            vocabularyMeaning.textContent = item.meaning;
            vocabularyWordCategory.textContent =
                `Category: ${item.category}`;

            vocabularyDetails.hidden = false;

            vocabularyGrid.querySelectorAll(".vocabulary-card")
                .forEach((otherCard) => {
                    otherCard.classList.remove("active");
                    otherCard.setAttribute("aria-pressed", "false");
                });

            card.classList.add("active");
            card.setAttribute("aria-pressed", "true");
        });

        vocabularyGrid.appendChild(card);
    });
}

if (vocabularySearch && vocabularyCategory) {
    vocabularySearch.addEventListener("input", renderVocabulary);
    vocabularyCategory.addEventListener("change", renderVocabulary);

    speakVocabularyBtn.addEventListener("click", () => {
        if (!selectedVocabularyWord) return;

        if (!("speechSynthesis" in window)) {
            vocabularyMeaning.textContent =
                "Text-to-speech is not supported in this browser.";
            return;
        }

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(
            `${selectedVocabularyWord.word}. ${selectedVocabularyWord.meaning}`
        );

        speech.lang = "en-IN";
        window.speechSynthesis.speak(speech);
    });

    renderVocabulary();
}
// Accessibility Settings
document.addEventListener("DOMContentLoaded", function () {
    const accessibilityToggle = document.getElementById("accessibilityToggle");
    const accessibilityPanel = document.getElementById("accessibilityPanel");

    if (accessibilityToggle && accessibilityPanel) {
        accessibilityToggle.addEventListener("click", function () {
            accessibilityPanel.hidden = !accessibilityPanel.hidden;

            accessibilityToggle.setAttribute(
                "aria-expanded",
                String(!accessibilityPanel.hidden)
            );
        });
    }
});
// Fix Accessibility Text Size and Reset Settings

document.addEventListener("DOMContentLoaded", function () {
    const increaseText = document.getElementById("increaseText");
    const decreaseText = document.getElementById("decreaseText");
    const highContrastToggle = document.getElementById("highContrastToggle");
    const readingModeToggle = document.getElementById("readingModeToggle");
    const resetAccessibility = document.getElementById("resetAccessibility");

    let textSize = 100;

    // Increase text size
    if (increaseText) {
        increaseText.addEventListener("click", function () {
            if (textSize < 125) {
                textSize += 5;
                document.documentElement.style.fontSize = textSize + "%";
            }
        });
    }

    // Decrease text size
    if (decreaseText) {
        decreaseText.addEventListener("click", function () {
            if (textSize > 85) {
                textSize -= 5;
                document.documentElement.style.fontSize = textSize + "%";
            }
        });
    }

    // Reset all accessibility settings
    if (resetAccessibility) {
        resetAccessibility.addEventListener("click", function () {
            textSize = 100;
            document.documentElement.style.fontSize = "100%";

            if (highContrastToggle) {
                highContrastToggle.checked = false;
            }

            if (readingModeToggle) {
                readingModeToggle.checked = false;
            }

            document.body.classList.remove("high-contrast");
            document.body.classList.remove("reading-mode");

            const panel = document.getElementById("accessibilityPanel");
            const toggle = document.getElementById("accessibilityToggle");

            if (panel) {
                panel.hidden = true;
            }

            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }
});
// =====================================
// SIGNBRIDGE INTERACTIVE A-Z ALPHABET
// =====================================

(function setupAlphabetChart() {
    const alphabetGrid = document.getElementById("alphabetGrid");
    const alphabetSearch = document.getElementById("alphabetSearch");
    const alphabetDetails = document.getElementById("alphabetDetails");
    const selectedLetter = document.getElementById("selectedLetter");
    const alphabetSignMedia = document.getElementById("alphabetSignMedia");
    const alphabetDescription = document.getElementById("alphabetDescription");

    if (
        !alphabetGrid ||
        !alphabetSearch ||
        !alphabetDetails ||
        !selectedLetter ||
        !alphabetSignMedia ||
        !alphabetDescription
    ) {
        return;
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let activeLetter = null;

    function showLetter(letter) {
        activeLetter = letter;

        selectedLetter.textContent = `Letter ${letter}`;

        // Do not invent or display an unverified handshape.
        alphabetSignMedia.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            `A verified ISL fingerspelling image for ${letter} has not yet been added.`;

        alphabetSignMedia.appendChild(message);

        alphabetDescription.textContent =
            `Use the official ISL learning resources below to check the correct fingerspelling for ${letter}.`;

        alphabetDetails.hidden = false;

        renderLetters(alphabetSearch.value);
    }

    function renderLetters(search = "") {
        const query = search.trim().toUpperCase();

        alphabetGrid.replaceChildren();

        const filteredLetters = letters.filter(letter =>
            letter.includes(query)
        );

        if (filteredLetters.length === 0) {
            const message = document.createElement("p");
            message.textContent = "Enter a letter from A to Z.";
            alphabetGrid.appendChild(message);
            return;
        }

        filteredLetters.forEach(letter => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "alphabet-letter";
            button.textContent = letter;
            button.setAttribute(
                "aria-pressed",
                String(letter === activeLetter)
            );
            button.setAttribute("aria-label", `Explore letter ${letter}`);

            button.addEventListener("click", () => {
                showLetter(letter);
            });

            alphabetGrid.appendChild(button);
        });
    }

    alphabetSearch.addEventListener("input", () => {
        const query = alphabetSearch.value.trim().toUpperCase();

        renderLetters(query);

        if (query.length === 1 && letters.includes(query)) {
            showLetter(query);
        }
    });

    renderLetters();
})();