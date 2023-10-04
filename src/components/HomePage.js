/* global chrome */
import React, { useEffect, useState } from "react";


// Components
import CustomButton from "./common/CustomButton";
import Loader from "./common/Loader";
import FooterButtons from "./common/FooterButtons";

// Importing various icons and logo from assets
import { CopyIcon, TranslateIcon, Speak, Logo, Pause } from '../assests/index.js'

// Importing customHook for Apicall
import { useApiResponse } from "../utils/getResponse";


function HomePage() {
    const [activeTabUrl, setActiveTabUrl] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [speechPaused, setSpeechPaused] = useState(false);
    const {
        translate,
        data,
        error,
        loading,
        gptResponse
    } = useApiResponse();

    const handleCopyClick = () => {
        navigator.clipboard
            .writeText(data)
    };

    const handleTranslate = () => {
        translate(data);
    };

    useEffect(() => {
        // Wrap chrome.tabs.query in a Promise to use async/await
        const getActiveTab = new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(tabs[0].url);
                }
            });
        });

        getActiveTab.then(setActiveTabUrl);
    }, []);

    const handleGenerateResponse = (content, btnText) => {
        setButtonText(btnText);
        gptResponse(content);
    };


    const handleSpeak = () => {
        var msg = new SpeechSynthesisUtterance(data);
        msg.rate = 0.9
        msg.lang = "hi-IN"
        msg.onend = function (event) {
            setSpeechPaused(false);
        }
        window.speechSynthesis.speak(msg)
        setSpeechPaused(true)

    }

    const handleTogglePress = () => {
        window.speechSynthesis.cancel();
        setSpeechPaused(false)
    }

    const generateSummary = () => {
        handleGenerateResponse(`Make the summary of this ${activeTabUrl}`, "Summary")
    }

    const generateBulletPoints = () => {
        handleGenerateResponse(`Make the BulletPoints of this ${activeTabUrl}`, "Bullet-Points")
    }

    function Header() {
        return (
            <div className="header">
                <img
                    src={Logo}
                    height={30}
                    width={30}
                    className='logo'
                    alt="logo"
                />
                <h3 className="heading">QuickGlance</h3>
            </div>
        )
    }

    const Buttons = () => (
        <div className="buttonArea">
            <CustomButton text="Summary" onClick={generateSummary} />
            <CustomButton text="Bullet-Points" onClick={generateBulletPoints} />
        </div>
    );

    const renderAssistantText = () => (
        <h4 className="assitantText">
            <ul>
                {data.split('\n').map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </h4>
    );

    const renderFooterButtons = () => (
        <div className="footerbutton">
            <FooterButtons icon={CopyIcon} onClick={handleCopyClick} />
            {speechPaused ? (
                <FooterButtons icon={Pause} onClick={handleTogglePress} />
            ) : (
                <FooterButtons icon={Speak} onClick={handleSpeak} />
            )}
            <FooterButtons icon={TranslateIcon} onClick={handleTranslate} />
        </div>
    );

    const renderContent = () => {
        // If loading, return the Loader component
        if (loading) {
            return <Loader />;
        }

        // If assistant text is available, return the text and associated components
        if (data) {
            return (
                <>
                    <h3>
                        Article <span className="summary">{buttonText} :</span>
                    </h3>
                    {renderAssistantText()}
                </>
            );
        }

        // If none of the conditions are met, return null
        return null;
    };

    const renderErrorOrClickText = () => {
        // If there's an error, display the error message
        if (error) {
            return <h5 className="error">Oops! Something went wrong<br /> {error}</h5>;
        }

        // If there's no assistant text and it's not loading, display the clickText
        if (!data && !loading) {
            return <h4 className="clickText">Read Less, Know More 📖<br />Quick and Clear 📌</h4>;
        }

        return null;
    };

    //main return
    return (
        <>
            <Header />
            <div className="sub-component">
                <Buttons />
                {renderErrorOrClickText()}
                {renderContent()}
            </div>
            {data && renderFooterButtons()}
        </>
    );
}

export default HomePage;


