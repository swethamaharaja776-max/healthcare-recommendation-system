package com.healthcare.controller;


import org.springframework.web.bind.annotation.*;

import java.util.*;



@RestController

@RequestMapping("/api")

@CrossOrigin(origins="*")

public class HealthcareController {



@PostMapping("/analyze")

public Map<String,Object> analyze(
@RequestBody Map<String,String> request
){


String symptom=request
.get("symptom")
.toLowerCase();



Map<String,Object> result=new HashMap<>();



if(symptom.contains("fever")){


result.put("disease",
"Viral Fever");


result.put("confidence",
90);


result.put("risk",
"Moderate");


result.put("recommendation",
"Drink plenty of water, take rest and monitor temperature.");



}


else if(symptom.contains("cold")){


result.put("disease",
"Common Cold");


result.put("confidence",
85);


result.put("risk",
"Low");


result.put("recommendation",
"Drink warm fluids and take adequate rest.");



}



else if(symptom.contains("cough")){


result.put("disease",
"Respiratory Infection");


result.put("confidence",
80);


result.put("risk",
"Moderate");


result.put("recommendation",
"Drink warm water and consult doctor if symptoms continue.");



}


else{


result.put("disease",
"Healthy");


result.put("confidence",
95);


result.put("risk",
"Low");


result.put("recommendation",
"Maintain healthy lifestyle.");

}


return result;


}


}
