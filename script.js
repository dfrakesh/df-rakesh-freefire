const SUPABASE_URL = "https://siipvlsrvdwkivpfxtkq.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_6D0gwy4V3wbzpclceVZMxA_YHbVHdaV";


const target = new Date('2026-08-20T18:00:00').getTime();

const el = document.getElementById('countdown');


function update(){

  const now = Date.now();

  const d = target - now;

  if(d <= 0){
    el.textContent = 'Tournament is Live!';
    return;
  }

  const days = Math.floor(d / 86400000);
  const hrs = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);

  el.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;
}


update();

setInterval(update, 1000);



async function loadWebsiteSettings(){

  try{

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?select=*`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_KEY
        }
      }
    );


    if(!response.ok){

      console.error(
        "Supabase error:",
        await response.text()
      );

      return;
    }


    const data = await response.json();


    data.forEach(item => {

      const value = item.setting_value || "";

      const element =
        document.getElementById(item.setting_name);


      if(element){

        if(item.setting_name === "registration_link"){

          element.href = value;

        }else{

          element.textContent = value;

        }

      }

    });


    const qr = data.find(
      item => item.setting_name === "qr_url"
    );


    if(qr && qr.setting_value){

      const qrSection =
        document.getElementById("qr_section");

      const qrImage =
        document.getElementById("qr_image");


      qrImage.src = qr.setting_value;

      qrSection.style.display = "block";

    }


  }catch(error){

    console.error(
      "Failed to load settings:",
      error
    );

  }

}


loadWebsiteSettings();
