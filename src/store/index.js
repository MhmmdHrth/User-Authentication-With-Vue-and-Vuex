import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios'
import globalAxios from 'axios'
import router from "../router/index"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken:null,
    userId:null,
    users: []
  },

  mutations: {
    authUser(state,authData){
      state.idToken = authData.idToken,
      state.userId = authData.userId
    },

    getUser(state,payload){
      state.users = payload
    },

    logOut(state){
      state.idToken = null
      state.userId = null
    }
  },

  actions: {
    signup({commit,dispatch},authData){
      axios.post(":signUp?key=AIzaSyBbaYNmOfjvEPog16kfKpQ2AIGWYC3P5_c", {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true})
          .then(res => {
            console.log("signup",res.data)
            commit('authUser', {
              idToken: res.data.idToken,
              userId: res.data.localId
            })

            dispatch("storeUser",authData)

            //store to local storage
            const now = new Date()
            const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
            localStorage.setItem("idToken", res.data.idToken)
            localStorage.setItem("userId", res.data.localId)
            localStorage.setItem("expirationDate", expirationDate)
          })
          .catch(err => console.log(err))
    },

    signin({commit},authData){
      axios.post(":signInWithPassword?key=AIzaSyBbaYNmOfjvEPog16kfKpQ2AIGWYC3P5_c",{
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
      .then(res => {
        console.log("signin",res.data)
        commit('authUser', {
          idToken: res.data.idToken,
          userId: res.data.localId
        })

         //store to local storage
         const now = new Date()
         const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
         localStorage.setItem("idToken", res.data.idToken)
         localStorage.setItem("userId", res.data.localId)
         localStorage.setItem("expirationDate", expirationDate)
      })
      .catch(err => console.log(err))
    },

    storeUser({commit,state}, userData){
      if(!state.idToken){
        return
      }
      globalAxios.post("/user.json" + "?auth=" + state.idToken ,userData)
        .then(res => {
          console.log(res)
          commit("")
        })
        .catch(err => console.log(err))
    },

    getUser({commit,state}){
      if(!state.idToken){
        return
      }
      globalAxios.get("/user.json" + "?auth=" + state.idToken)
      .then(res => {
        const users = [];
        const data = res.data
        for (let key in data) {
          const user = data[key];
          users.push(user);
        }
        console.log(users);
        commit("getUser",users)
      });
    },

    logOut({commit}){
      commit("logOut")

      //remove local storage when logout
      localStorage.removeItem("idToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("expirationDate")

      router.push('/signin')
    },

    autoLogin({commit}){
        const token = localStorage.getItem("idToken")
        const id = localStorage.getItem("userId")
        const expirationDate = localStorage.getItem("expirationDate")
        const now = new Date()

        if(!token){
          return
        }

        if(!id){
          return
        }

        if(now >= expirationDate){
          return
        }
        commit("authUser",{
          idToken:token,
          userId: id
        })
    }
    
  },

  getters:{
    getUsers(state){
      return state.users
    },

    authentication(state){
      return state.idToken !== null
    }
  },

  modules: {

  }
})
