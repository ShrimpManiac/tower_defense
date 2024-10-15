const authorizeUser = async () => {
  if (!document.cookie.includes('authorization')) {
    alert('로그인 필요');
    window.location.href = 'login.html';
    return null;
  }

  const res = await fetch('http://localhost:3000/api/auth', {
    method: 'get',
    credentials: 'include',
  });

  if (!res.ok) {
    alert('로그인 오류');
    const result = await res.json();
    console.log(result.errorMessage);
    return null;
  }

  const result = await res.json();
  console.log(result.message);

  return result.data.id;
};

export const id = await authorizeUser();
