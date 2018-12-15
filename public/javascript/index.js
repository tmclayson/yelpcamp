function showPassword() {
    const x = document.getElementById('loginFormPassword');
    if (x.type === 'password') {
        x.type = 'text';
    } else {
        x.type = 'password';
    }
}
