import {Header, LinearProgress} from "@/common/components";
import {useGlobalLoading} from "@/common/hooks";
import {Routing} from "@/common/routing";
import s from "@/app/App.module.css";
import {ToastContainer} from "react-toastify";



export const App = () => {

    const isGlobalLoading = useGlobalLoading();

    return (
        <>
            <Header/>
            {isGlobalLoading && <LinearProgress/>}
            <div className={s.layout}>
                <Routing/>
            </div>
            <ToastContainer/>
        </>
    )
}

export default App
