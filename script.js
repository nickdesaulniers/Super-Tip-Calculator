$(document).ready(function () {
  (function (undefined) {
    function trunc_two_decimal_places (my_float) {
			return parseFloat(my_float.toFixed(2));
		}
		function round_two_decimal_places (my_float) {
			return Math.round(my_float * 100) / 100;
		}
		function calculate_total () {
			var sub_total = trunc_two_decimal_places(parseFloat(
			  document.getElementById('sub_total').value));
			var info = document.getElementById('info');
			if (sub_total) {
				var tip = parseFloat((parseFloat(document.getElementById(
				  'tip_percent').textContent) / 100 * sub_total).toFixed(2));
				var total = round_two_decimal_places(sub_total + tip);
				var tip_ele = document.getElementById('tip');
				var total_ele = document.getElementById('total');
				tip_ele.innerHTML = '';
				total_ele.innerHTML = '';
				tip_ele.appendChild(document.createTextNode(tip.toFixed(2)));
				total_ele.appendChild(document.createTextNode(total.toFixed(2)));
				info.style.display = 'inline';
			} else {
				info.style.display = 'none';
			}
		}
		function change_tip (change_by_int) {
			var tip_percent_ele = document.getElementById('tip_percent');
			var current_tip_percent = parseInt(tip_percent_ele.textContent);
			if (current_tip_percent > 0 && change_by_int < 0 ||
				current_tip_percent < 100 && change_by_int > 0) {
				var new_tip_percent = parseInt(tip_percent_ele.textContent) + change_by_int;
				tip_percent_ele.replaceChild(document.createTextNode(new_tip_percent),
					tip_percent_ele.firstChild);
				calculate_total();
			}
		}
		
		function stop_spinner () {
		  var ajax_spinner_ele = document.getElementById('ajax_spinner');
		  ajax_spinner_ele.parentNode.removeChild(ajax_spinner_ele);
		}
		
		function verification_success (data, text_status, jqXHR) {
		  //stop_spinner();
		  //console.log(data);
	    //console.log(text_status);
	    //console.log(jqXHR);
	    if (jqXHR.status == 200) {
	      //console.log(jqXHR.responseText.length);
	      
	      // This is shit I know but it's a quick hack for my demo
	      if (jqXHR.responseText.length > 60) {
	        verification_failure();
	      } else {
	        stop_spinner();
	        // Events
    			$('#sub_total').change(calculate_total).keyup(function (e) {
    			  if ((e.keyCode || e.which) == 13) calculate_total();
    			});
    			$('#increment_tip').click(function () {
    			  change_tip(1);
    			});
    			$('#decrement_tip').click(function () {
    			  change_tip(-1);
    			});
    			document.getElementById('sub_total').removeAttribute('disabled');
	      }
  		} else {
	      alert('Non 200 success message on verification: ' + jqXHR.status);
	    }
		}
		
		function verification_failure () {
		  var ajax_spinner_ele = document.getElementById('ajax_spinner');
		  ajax_spinner_ele.innerHTML = '';
		  var span = document.createElement('span');
		  span.setAttribute('class', 'hint red');
		  span.appendChild(document.createTextNode('Invalid Receipt'));
		  ajax_spinner_ele.appendChild(span);
		}

		// Install code
		var request = window.navigator.mozApps.getSelf();
		request.onerror = function (e) {
			console.log('getSelf Error: ' + request.error.name);
		}
		request.onsuccess = function (e) {
			//console.log('getSelf Success');
			var appRecord = request.result;
			console.log(appRecord);
			var appRecordCopy = $.extend(true, {}, appRecord);

			// post
			$.ajax({
			  type: 'POST',
			  url: '/',
			  contentType: 'application/json',
			  //dataType: 'json',
			  data: JSON.stringify(appRecordCopy),
			  //data: JSON.stringify(appRecord),
			  success: verification_success,
			  error: verification_failure
			});
			
			if (appRecord === null) {
				var pending = window.navigator.mozApps.install('http://lostoracle.net:3000/manifest.webapp');
				pending.onsuccess = function () {
					console.log('install Success');
					var appRecord = this.result;
				}
				pending.onerror = function () {
					console.log('install Error');
					console.log(this.error.name);
				}
			}
		}
		
		// Connetivity
		window.addEventListener('not_connected', function () {
		  console.log('disconnected');
		});
		window.addEventListener('connected', function () {
		  console.log('connected');
		});
		window.addEventListener('connection_timeout', function () {
		  console.log('timeout');
		});
		Connectivity.poll('cache.manifest', 1000, 5000, true);
		
  })();
});