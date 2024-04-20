import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import SelectorRecorder from "~/selector-recorder";
import {
    RecoilRoot,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';
import { selectorListAtom } from "~/store";
import { useEffect } from "react";

export const config: PlasmoCSConfig = {
    matches: ["https://ads.tiktok.com/*"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}
const RecorderOverlay = () => {
    const selectorList = useRecoilValue(selectorListAtom);
    const setSelectorListAtom = useSetRecoilState(selectorListAtom);
    useEffect(() => {
        const recorder = new SelectorRecorder(setSelectorListAtom);
        return () => {
            recorder.destroy();
        };
    }, []);
    return (
        <RecoilRoot>
            <div className="recorder-z-50 recorder-flex recorder-fixed recorder-top-32 recorder-right-8">
                {
                    selectorList.map((item) => {
                        return <div>
                            selector: {item.selector}
                        </div>
                    })
                }
            </div>
        </RecoilRoot>
    )
}

export default RecorderOverlay
