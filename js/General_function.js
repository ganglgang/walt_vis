

function TimeGenerate(start_time) {

    let x = 30; //minutes interval
    let times = []; // time array
    let tt = start_time; // start time
    let limit = Math.floor(tt / 60)+12;
//loop to increment the time and push results in array
    for (let i = 0; tt <= limit * 60; i++) {
        let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        let mm = (tt % 60); // getting minutes of the hour in 0-55 format
        times[i] = ("0" + (hh%24)).slice(-2) + ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
        tt = tt + x;
    }
    return times
}


function Generator(start_time,data){
    let result = []
    let time_line = TimeGenerate(start_time);
    let new_line = []

    let date1 = data[0]['DateRec'].toLocaleDateString();
    let date2 = data[data.length-1]['DateRec'].toLocaleDateString();


    let standard_time;
    if(start_time==1140){

    }else{
        standard_time = date2+' '+'07:00';
        standard_time = new Date(Date.parse(standard_time));
        date1 = date2;

    }
    let date = data[0]['DateRec'].toLocaleDateString();
    time_line.forEach(function(d,i){
        result[d] = [];
        if(i>=10){
            d=date2+" "+d;
        }else{
            d=date1+" "+d;
        }

        d = new Date(Date.parse(d));
        new_line.push(d);
    })

    if(start_time==1140){
        for (let i = 0; i < data.length;i++){
            for(let j = 1; j< new_line.length;j++){
                if (data[i]['DateRec'] < new_line[j]){
                    result[time_line[j]].push(data[i]);
                    break;
                }

            }
        }
    }else{

        for (let i = 0; i < data.length;i++){
            for(let j = 1; j< new_line.length;j++){
                if (data[i]['DateRec'] < new_line[j] && standard_time<data[i]['DateRec']){
                    result[time_line[j]].push(data[i]);
                    break;
                }

            }
        }
    }
    return result;
}

function time_transfer(date){
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if(h<10){
        h = "0"+h.toString();
    }
    if(m<10){
        m = "0"+m.toString();
    }
    if(s<10){
        s = "0"+s.toString();
    }
    let time = h+":"+m+":"+s;
    return time;
}


function calculate_duration(duration){

    let time = Math.floor(duration / 1000);
    let h = Math.floor(time / 3600);
    let m = Math.floor(time / 60 % 60);
    let s = Math.floor(time % 60);
    if (h < 10) {
        h = "0" + h.toString();
    }
    if (m < 10) {
        m = "0" + m.toString();
    }
    if (s < 10) {
        s = "0" + s.toString();
    }
    time = h + ":" + m + ":" + s
    return time
}

function load_machine_data(machine_number,result_data,timeline){
    let id = machine_number;
    let id_information = {};
    for(let i in timeline) {
        let time = timeline[i];
        id_information[time] = []
        let obj = result_data[time]
        for(i in obj){
            if (obj[i]['MachCode']==id.toString()){
                id_information[time].push(obj[i])
            }
        }
    }
    return id_information
}


function vSort(dict){
    let result = []
    let dic = dict;
    let res_counts = Object.keys(dic).sort(function(a,b){
        return dic[b]['counts']-dic[a]['counts'];
    });
    result.push(res_counts);
    let res_down = Object.keys(dic).sort(function(a,b){
        return dic[b]['downtime']-dic[a]['downtime'];
    });
    result.push(res_down);
    return result;
}

function clean_load_data(start_time,data) {

    let summary_dict = {}
    for (let i in start_time) {
        let time = start_time[i];
        for (let j in data[time]) {
            let obj = data[time][j];
            if (obj['MachCode'] in summary_dict) {
                let s_time = obj['DateRec'];
                let e_time = obj['DateEndStop']
                let duration = e_time.getTime() - s_time.getTime()
                summary_dict[obj['MachCode']]['duration'] += duration
                summary_dict[obj['MachCode']]['count'] += 1;
            } else {
                let s_time = obj['DateRec'];
                let e_time = obj['DateEndStop']
                let duration = e_time.getTime() - s_time.getTime()
                duration = Math.floor(duration / (1000))
                summary_dict[obj['MachCode']] = {'MachCode': obj['MachCode'], 'count': 1, 'duration': duration}
            }
        }
    }
    return summary_dict;
}