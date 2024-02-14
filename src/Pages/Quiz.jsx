import {React, useState, useEffect} from "react";
import QuestionAnswer from "../components/QuestionAnswer";
import {decode} from 'html-entities';
import nanoid from "nanoid";

export default function Quiz(){
    const [questions,setQuestions] = useState([])
    const [isFinished,setIsFinished] = useState(false)
    const [playAgain, setPlayAgain] =useState(false)
    const [points, setPoints] = useState(0)

    

    useEffect(()=>{
        fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple')
            .then(res => res.json())
            .then(data => {
                console.log('fetched')
                const questionsArr=[]
                data.results.forEach(element => {
                    const choices = element.incorrect_answers
                    choices.push(element.correct_answer)
                    const decoded_choices=choices.map(choice => decode(choice))
                    questionsArr.push({
                        question : decode(element.question),
                        correctAnswer : decode(element.correct_answer),
                        choices : shuffle(decoded_choices),
                        id: nanoid(),
                        selectedAnswer: ""
                    })
                })
                setQuestions(questionsArr)
            })
    },[playAgain])

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }


    function handleChange(event,ques,answer) {
        const {name, value} = event.target
        setQuestions(prevAnswers=>{
        let exists=false

        for(let i=0;i<prevAnswers.length;i++){
            if(prevAnswers[i].id===name){
                exists=true
            }
        }
        if(exists){
            return prevAnswers.map(obj => {
                return obj.id===name ? {...obj,'selectedAnswer' : value } : obj
            })
        }
        else{
            return [...prevAnswers,{
                'question' : ques,
                'answer' : answer,
                'id' : name,
                'selectedAnswer' : value
            }]
        }
        })
    }

    console.log(questions)

    function checkAnswers(){
        for(let i=0;i<questions.length;i++){
            if(questions[i].selectedAnswer==""){
                return
            }
        }
        questions.map(ques=>{
            if(ques.selectedAnswer===ques.correctAnswer){
                setPoints(prevPoints => prevPoints+1)
            }
        })
        setIsFinished(true)
    }

    function newGame(){
        setPlayAgain(prevVal => !prevVal)
        setIsFinished(false)
        setPoints(0)
    }

    const questionElements= questions.map((quesObj,index) => {
        return <QuestionAnswer 
                key={quesObj.id}
                id={quesObj.id}
                question={quesObj.question}
                choices={quesObj.choices}
                correctAnswer={quesObj.correctAnswer}
                handleChange ={handleChange}
                finished = {isFinished}
                selectedAnswer = {quesObj.selectedAnswer}
               />
    })

    return (
        <div>
             <svg  className="blob-one" xmlns="http://www.w3.org/2000/svg" width="158" height="141" viewBox="0 0 158 141" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M63.4095 81.3947C35.1213 50.8508 -2.68211 21.7816 1.17274 -19.6933C5.43941 -65.599 39.854 -105.359 82.4191 -123.133C122.797 -139.994 170.035 -130.256 205.822 -105.149C235.947 -84.0141 236.823 -43.8756 246.141 -8.27104C256.17 30.0508 282.521 70.8106 260.501 103.779C237.538 138.159 188.991 143.432 147.931 138.768C112.318 134.723 87.7505 107.677 63.4095 81.3947Z" fill="#FFFAD1"/>
            </svg>
            <svg className="blob-two" xmlns="http://www.w3.org/2000/svg" width="148" height="118" viewBox="0 0 148 118" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M-5.55191 4.90596C35.9614 1.77498 82.2425 -9.72149 112.306 19.1094C145.581 51.0203 155.282 102.703 142.701 147.081C130.767 189.18 93.7448 220.092 51.8208 232.476C16.5281 242.902 -15.4332 218.605 -49.1007 203.738C-85.3375 187.737 -133.641 182.993 -145.741 145.239C-158.358 105.868 -132.269 64.5881 -103.064 35.3528C-77.7328 9.99541 -41.2727 7.60006 -5.55191 4.90596Z" fill="#DEEBF8"/>
            </svg>
            {questionElements}
            {isFinished ? <div className="finish"><h3>You scored {points}/5 correct answers</h3><button onClick={newGame}>Play again</button></div>
             : <button className="check-btn" onClick={checkAnswers}>Check answers</button>}
            
        </div>
    )
}