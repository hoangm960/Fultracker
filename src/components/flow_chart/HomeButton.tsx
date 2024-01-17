import BackIcon from "@assets/icons/back.png";
import RefreshIcon from "@assets/icons/refresh.png";


function HomeButton({ updateFlow }) {
    return (
        <button
            className="bg-action px-5 py-3 border-solid border-text border-2 text-highlight text-xl text-center font-bold flex-1 h-fit rounded-2xl flex flex-row gap-5 items-center justify-start hover:shadow-2xl hover:opacity-80"
            onClick={updateFlow}
        >
            <img src={BackIcon.src} alt="Back icon" />
            Back to Main Layout
            <span className="text-background text-2xl text-center font-bold">or</span>
            <img src={RefreshIcon.src} alt="Refresh icon" />
            Refresh flowchart
        </button>
    );
}

export default HomeButton;