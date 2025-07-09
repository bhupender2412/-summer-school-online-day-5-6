const API_KEY="cb2936160cd5420bad682703250607";

document.getElementById("weatherResult").innerHTML=localStorage.getItem("lastWeather")||"";

document.getElementById("getWeatherBtn").addEventListener("click",() => {
    const resultDiv = document.getElementById("weatherResult");
    const spinner=document.getElementById("spinner");
    spinner.style.display="block";

    resultDiv.innerHTML = "⏳Fetching weather...";

    if(!navigator.geolocation){
        resultDiv.innerHTML="Geolocation is not supported.";
        spinner.style.display="none";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const{ latitude ,longitude } =position.coords;

            const useFahrenheit=document.getElementById("unitToggle").checked;
            const unit=useFahrenheit?"f":"c";

            const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`;

            fetch(url)
            .then((response)=>response.json())
            .then((data)=>{
                spinner.style.display="none";
                if(data.error){
                    throw new Error(data.error.message);
                }
                const city=data.location.name;
                const temp=unit==="f"?data.current.temp_f:data.current.temp_c;
                const tempUnit=unit==="f"?"°F":"°C";
                const condition= data.current.condition.text;
                const iconurl="https:"+data.current.condition.icon;
                

                resultDiv.innerHTML=`
                <strong>${city}</strong><br>
                <img src="${iconurl}" alt="${condition}"/><br>
                🌡️ ${temp}${tempUnit}<br>
                ☁️ ${condition}
                
                `;
                localStorage.setItem("lastWeather",resultDiv.innerHTML);
                
            })
            .catch((error)=>{
                spinner.style.display="none";
                resultDiv.innerHTML="⚠️ Failed to get weather."
                console.error("Weather API Error:",error);
            });
        },
        (error)=>{
            spinner.style.display="none";
            resultDiv.innerHTML="⚠️ Locstion permission denied.";
        }
    );
    
});