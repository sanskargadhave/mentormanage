import "./AiAvtar.css";
function AiAvtar({online=true}){
    return(
    <div className="ai-avatar">

            <div className="ai-avatar-ring">

                <div className="ai-avatar-core">

                    <span>🕸️</span>

                </div>

            </div>

            <div className="ai-avatar-details">

                <h3>Saarthi AI</h3>

                <p>
                    {online ? "Online • Ready to Assist" : "Offline"}
                </p>

            </div>

        </div>
);
}
export default AiAvtar;