const solutionsWaitTime=2.5e3,solutionsStatements=["Contact your local policy makers.","Volunteer in ocean-cleaning projects.","Reduce the usage of electricity.","Ride more eco-friendly vehicles.","Spread the word about this issue.","Talk about this in the classroom.","Reduce usage on fossil fuels.","Use more renewable resources.","Begin research projects to learn more.","Stay informed about this issue.","Help clean up litter on beaches.","Support Ocean-Cleaning NGOs."].shuffle();function startSolutions(e){var t=e||"";inTyping=!1;do{var i=solutionsStatements.randomItem()}while(i==t);writeSetence(i,2)}function writeSetence(e,t){if(0!=e.length&&!inTyping){inTyping=!0;var i=e.split(""),s=1e3*t/i.length;$("#solutions-descrip").html($("#solutions-descrip").html()+"|"),setTimeout(clearChar,s,i,0,s)}}function clearChar(e,t,i){$("#solutions-descrip").html($("#solutions-descrip").html().slice(0,-2)+"|"),1!=$("#solutions-descrip").html().length?setTimeout(clearChar,i/3,e,t,i):setTimeout(writeChar,i,e,t,i)}function writeChar(e,t,i){$("#solutions-descrip").html($("#solutions-descrip").html().slice(0,-1)+e[t]+"|"),e[t+1]?setTimeout(function(){writeChar(e,t+1,i)},i):($("#solutions-descrip").html($("#solutions-descrip").html().slice(0,-1)),inTyping=!1,setTimeout(startSolutions,solutionsWaitTime,e.join("")))}