import nanoid from "nanoid";
import React from "react";

export default function QuestionAnswer(props){

const choiceElement = props.choices.map((choice) =>{
    const currID= nanoid()
    let styles = {}

    if(choice==props.correctAnswer){
        styles = {
            background: "#94D7A2",
            border: "none"
        }
    }
    else if(choice==props.selectedAnswer){
        styles = {
            background: "#F8BCBC",
            border: "none",
        }
    }
    else {
        styles = {
            opacity: "0.5"
        }
    }
    
    return (
        <div className="container-choices">
        <input 
            type="radio"
            id={currID}
            name={props.id}
            value={choice}
            onChange={() => props.handleChange(event,props.question,props.correctAnswer)}
        />
        <label style={props.finished ? styles : {}} htmlFor={currID}>{choice}</label>
        </div>
    )
})

    return (
        <div>
            <h3 className="question">{props.question}</h3>
            <fieldset>
                {choiceElement}
            </fieldset>
        </div>
    )
}


