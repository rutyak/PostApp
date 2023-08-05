

window.addEventListener('DOMContentLoaded', async () => {  // fetchig ip address
    const ipAddressElement = document.getElementById('co-ordinates');

    try {
        const response = await fetch("https://ipinfo.io/223.233.64.63?token=9b02eaea83291e");
        const data = await response.json();
        
        ipAddressElement.textContent = data.ip;
        
        console.log(data);
    } catch (error) {
        console.log('Error fetching IP address:', error);
    }
});


// timezone, date 
function displayInfo(mapData) {
    //  timezone
    const timezone = new Intl.DateTimeFormat(undefined, { timeZoneName: 'long' }).format();
  

    const time_zone = document.getElementById('time-zone');
    const date_time = document.getElementById('dateandtime');
    const pincode = document.getElementById('piconde');

    // date and time
    const now = new Date();
   
    const options = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };


    const date = timezone.split(',')[0];

    // Get hours, minutes, and seconds from the Date object
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format the time in hh:mm:ss format
    const formattedTime = `${paddingZero(hours)}:${paddingZero(minutes)}:${paddingZero(seconds)}`;


    function paddingZero(number) {
        return number < 10 ? `0${number}` : number;
    }
    console.log(date);
    console.log(formattedTime); // Output in hh:mm:ss
    console.log(timezone.split(',')[1].trim());

    
    const pin_code = mapData.zip;
    console.log(pin_code);

    time_zone.textContent = timezone.split(',')[1];
    date_time.textContent = ` ${date} ${formattedTime}`;
    pincode.textContent = ` ${mapData.zip}` || ' Not available';

    getPincodes(mapData);
}

//get pincode
async function getPincodes(mapData) {
    const message = document.getElementById('message');
    const pincodeInfoResponse = await fetch(`https://api.postalpincode.in/pincode/${mapData.zip}`);
    const pincodeInfoData = await pincodeInfoResponse.json();
    console.log(pincodeInfoData);
    message.textContent = `Number of pincode(s) found: ${pincodeInfoData[0].PostOffice.length}`;

    if (Array.isArray(pincodeInfoData[0].PostOffice) && pincodeInfoData.length > 0) {
        displayPO(pincodeInfoData[0].PostOffice);
    }
}

var postOffice_list = null;
function displayPO (postOffices) {
    if (postOffice_list === null) postOffice_list = postOffices;
    const cardBox = document.getElementById('po-cards-box');
    cardBox.innerHTML = '';
    console.log(postOffices);
    postOffices.forEach(postOffice => {
        const po_card = document.createElement('div');
        po_card.className = 'po-card';
        po_card.innerHTML = `
                <div>
                    <p><span>${postOffice.Name}</span></p>
                </div>
                <div>
                    <p><span>${postOffice.BranchType}</span></p>
                </div>
                <div>
                    <p><span>${postOffice.DeliveryStatus}</span></p>
                </div>
                <div>
                    <p><span>${postOffice.District}</span></p>
                </div>
                <div>
                    <p><span>${postOffice.Division}</span></p>
                </div>
            `;
        cardBox.appendChild(po_card);
    });
}

//searching posts
const searchBar = document.getElementById('searched-term');
searchBar.addEventListener('keyup', () => {
    console.log('keyup event', searchBar.value.toLowerCase());
    // filter the data
    let searched_term =  searchBar.value.toLowerCase();
    const filteredPOs = filterData(searched_term);

    displayPO(filteredPOs);
});


function filterData(searched_term) {
    // filter here
    var ansArray = postOffice_list.filter((postOffice) => {
        if (postOffice.Name.toLowerCase().includes(searched_term)) {
            return postOffice;
        }
    });

    return ansArray;
}

const getBtn = document.getElementById('get-btn');
const front = document.getElementById('front');
const locationPage = document.getElementById('locationPage');

//after get started click
getBtn.addEventListener('click', async () => {
    front.style.display = 'none';
    locationPage.style.display = 'block';
    
    const ipAddress = document.getElementById('ip-add');

    const ipAddFields = document.getElementsByClassName('ip-add-fiels');
    const map = document.getElementsByTagName('iframe')[0];

    const lat = document.getElementById('lat');
    const long = document.getElementById('long');
    const city = document.getElementById('city');
    const region = document.getElementById('region');
    const organisation = document.getElementById('organisation');
    const hostname = document.getElementById('hostname');

    try {

        const response = await fetch("https://ipinfo.io/223.233.64.63?token=9b02eaea83291e");
        const data = await response.json();

        // Fetching the map information based on IP
        const mapResponse = await fetch(`http://api.ipstack.com/${data.ip}?access_key=e7c237e6062bd6c622f381d13fd094af`);
        const mapData = await mapResponse.json();
        console.log(mapData);
        displayInfo(mapData);

        //Update the content with the map information
        const [latitude, longitude] = data.loc.split(',');

        ipAddress.textContent = mapData.ip;
        lat.textContent = latitude;
        long.textContent = longitude;
        organisation.textContent = data.org;
        city.textContent = mapData.city;
        hostname.textContent = data.hostname;
        region.textContent = mapData.region_name;

        // showing loaction on map 
        const newSrc = `https://maps.google.com/maps?q=${mapData.latitude}, ${mapData.longitude}&z=15&output=embed`;
        map.src=newSrc;
        
       
    } catch (error) {
        // If an error occurs, show an error message
      
        console.log('Error fetching IP address:', error);
    }
});