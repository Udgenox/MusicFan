import {Header} from "@/common/components";
import {Routing} from "@/common/routing";
import s from "@/app/App.module.css";



export const App = () => {
    return (
        <>
            <Header/>
            <div className={s.layout}>
                <Routing/>
            </div>
        </>
    )
}

export default App
