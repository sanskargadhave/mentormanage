import "./AiMessage.css";

function AiMessage({

    type = "ai",

    message,

    time,

    thinking = false

}) {

    return (

        <div className={`ai-message-row ${type}`}>

            {
                type === "ai" && (

                    <div className="ai-message-avatar">

                        🕸️

                    </div>

                )
            }

            <div className={`ai-message-bubble ${type}`}>

                {
                    thinking ?

                        <div className="ai-thinking">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                        :

                        <>

                            <p>{message}</p>

                            <small>{time}</small>

                        </>

                }

            </div>

        </div>

    );

}

export default AiMessage;