const auth = {
    signIn: (username: string, password: string) => {
        // Sign in logic here
        console.log(`Signing in with username: ${username} and password: ${password}`);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("token", username);
        return true; // Return true if sign-in is successful
    },
    checkSignIn: () => {
        if (sessionStorage.getItem("token")) {
            return true;
        }
        return false;
    }
}

export default auth;