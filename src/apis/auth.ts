import axios from 'axios';

const auth = {
    signIn: async (username: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:9090/api/login", null, {
                params: {
                    username,
                    password
                }
            });
            const data = response.data;
            console.log(data);

            if (data.token) {
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("token", data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Sign in error:", error);
            return false;
        }
    },
    checkSignIn: () => {
        return !!sessionStorage.getItem("token");
    }
}

export default auth;