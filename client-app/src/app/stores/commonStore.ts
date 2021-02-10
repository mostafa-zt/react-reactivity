import { makeAutoObservable, reaction } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore;
        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', this.token!);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    token: string | null = window.localStorage.getItem('jwt');
    appLoaded: boolean = false;

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }

}