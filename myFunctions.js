// هون منخفي ومنظهر جدول الوجبات أو المقبلات
function showCategory(tableId, btn) 
{
    document.getElementById('meals-table').style.display = 'none';
    document.getElementById('appetizers-table').style.display = 'none';

    var buttons = document.querySelectorAll('.btn-choice');
    buttons.forEach(function (button) 
    {
        button.classList.remove('active');
    });

    document.getElementById(tableId).style.display = 'table';
    btn.classList.add('active');
}

// هون منفتح ومنسكر تفاصيل الوجبة
function toggleDetails(rowId, checkbox) 
{
    var detailsRow = document.getElementById(rowId);

    if (checkbox.checked) 
        {
        detailsRow.style.display = 'table-row';
    } else 
        {
        detailsRow.style.display = 'none';
    }
}

// هون منجمع أسعار الوجبات اللي انختارت
function calculateTotal() 
{
    var total = 0;

    $('.meal-select:checked').each(function () 
    {
        var price = parseInt($(this).data('price'));
        total += price;
    });

    $('#total-price').text(total.toLocaleString() + ' ل.س');
}

// منظهر فورم الطلب بعد ما نكبس متابعة
function showOrderForm()
 {
    var selectedCount = $('.meal-select:checked').length;

    if (selectedCount === 0)
         {
        alert('يرجى اختيار وجبة واحدة على الأقل قبل المتابعة');
        return;
    }

    $('#order-section').slideDown();
    $('html, body').animate({
        scrollTop: $('#order-section').offset().top
    }, 500);
}

// منسكر نافذة تفاصيل الطلب
function closeModal() {
    $('#myModal').hide();
}

// تهيئة الصفحة أول ما تفتح
$(document).ready(function () 
{
    $('#appetizers-table').hide();

    // منخفي كل سطور التفاصيل بالبداية
    $('.details-row').hide();

    // منخفي نموذج الطلب بالبداية
    $('#order-section').hide();

    // منحدّث المجموع كل ما نختار وجبة أو نشيل الاختيار
    $('.meal-select').on('change', function () {
        calculateTotal();
    });

    // منشيّك بيانات الفورم وقت الإرسال
    $('#dataForm').on('submit', function (event) {
        event.preventDefault();

        var fullName = $('#fullName').val().trim();
        var nationalId = $('#nationalId').val().trim();
        var dob = $('#dob').val().trim();
        var phone = $('#phone').val().trim();
        var email = $('#email').val().trim();

        var nameRegex = /^[\u0600-\u06FF\s]+$/;
        var nationalIdRegex = /^(0[1-9]|1[0-4])[0-9]{9}$/;
        var dobRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        var phoneRegex = /^09(3|4|5|6|8|9)[0-9]{7}$/;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // الرقم الوطني هو الإجباري الوحيد
        if (nationalId === '') 
            {
            alert('الرقم الوطني إجباري');
            $('#nationalId').focus();
            return;
        }

        if (!nationalIdRegex.test(nationalId)) 
            {
            alert('الرقم الوطني غير صحيح، يجب أن يكون 11 خانة ويبدأ برمز محافظة من 01 إلى 14');
            $('#nationalId').focus();
            return;
        }

        // الاسم اختياري، بس إذا كتبناه لازم يكون عربي فقط
        if (fullName !== '' && !nameRegex.test(fullName))
             {
            alert('الاسم يجب أن يحتوي على أحرف عربية فقط');
            $('#fullName').focus();
            return;
        }

        // تاريخ الولادة اختياري، بس إذا انكتب لازم يكون dd-mm-yyyy
       if (dob !== '' && !dobRegex.test(dob)) {
               alert('تاريخ الولادة يجب أن يكون بالصيغة dd-mm-yyyy');
               $('#dob').focus();
                return;
             }     

        // رقم الموبايل اختياري، بس إذا انكتب لازم يمشي على صيغة سورية
        if (phone !== '' && !phoneRegex.test(phone))
             {
            alert('رقم الموبايل غير صحيح، يجب أن يبدأ مثل 093 أو 094 أو 095 أو 096 أو 098 أو 099');
            $('#phone').focus();
            return;
        }

        // الإيميل اختياري، بس إذا انكتب لازم يكون مظبوط
        if (email !== '' && !emailRegex.test(email)) 
            {
            alert('الإيميل غير صحيح');
            $('#email').focus();
            return;
        }

        var selectedMeals = [];
        var totalAmount = 0;

        $('.meal-select:checked').each(function () 
        {
            var code = $(this).data('code');
            var name = $(this).data('name');
            var price = parseInt($(this).data('price'));

            selectedMeals.push({
                code: code,
                name: name,
                price: price
            });

            totalAmount += price;
        });

        if (selectedMeals.length === 0)
             {
            alert('يرجى اختيار وجبة واحدة على الأقل');
            return;
        }

        var discount = totalAmount * 0.05;
        var finalPrice = totalAmount - discount;

        var mealsHtml = '<ul>';

        selectedMeals.forEach(function (meal) {
            mealsHtml += '<li>' +
                meal.code + ' - ' +
                meal.name + ' - ' +
                meal.price.toLocaleString() + ' ل.س' +
                '</li>';
        });

        mealsHtml += '</ul>';

        var invoiceHtml =
            '<p><strong>الاسم:</strong> ' + (fullName || 'لم يتم ادخاله') + '</p>' +
            '<p><strong>الرقم الوطني:</strong> ' + nationalId + '</p>' +
            '<p><strong>تاريخ الولادة:</strong> ' + (dob || 'لم يتم ادخاله') + '</p>' +
            '<p><strong>رقم الموبايل:</strong> ' + (phone || 'لم يتم ادخاله') + '</p>' +
            '<p><strong>الإيميل:</strong> ' + (email || 'لم يتم ادخاله') + '</p>' +
            '<hr>' +
            '<p><strong>الوجبات المختارة:</strong></p>' +
            mealsHtml +
            '<p><strong>المجموع قبل الحسم:</strong> ' + totalAmount.toLocaleString() + ' ل.س</p>' +
            '<p><strong>حسم 5%:</strong> ' + discount.toLocaleString() + ' ل.س</p>' +
            '<p class="green-price"><strong>المبلغ النهائي:</strong> ' + finalPrice.toLocaleString() + ' ل.س</p>';

        $('#modalDetails').html(invoiceHtml);
        $('#myModal').show();
    });

    // الكود بيتنفذ أول ما تفتح الصفحة
document.addEventListener("DOMContentLoaded", function()
 {
    // إذا كان عنوان الموقع بيحتوي على github.io (يعني أنت أونلاين)
    if (window.location.hostname.includes("github.io"))
         {
        var element = document.getElementById("publish-link-container");
        if (element) {
            element.remove(); // بيحزف الزر وكل النص اللي جنبه 
        }
    }
});
});