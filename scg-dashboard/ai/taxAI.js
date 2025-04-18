// taxAI.js
module.exports = {
    // ฟังก์ชันคำนวณภาษี
    calculateTax: function(salary) {
      let taxRate = 0.05; // สมมติอัตราภาษี 5%
      let taxAmount = salary * taxRate;
      return taxAmount;
    },
    
    // ฟังก์ชันคำนวณภาษีจากหลายระดับ
    calculateProgressiveTax: function(salary) {
      let taxAmount = 0;
      if (salary <= 500000) {
        taxAmount = salary * 0.05; // 5% สำหรับเงินเดือนต่ำกว่า 500,000
      } else if (salary <= 1000000) {
        taxAmount = 500000 * 0.05 + (salary - 500000) * 0.1; // 10% สำหรับเงินเดือนระหว่าง 500,000 ถึง 1,000,000
      } else {
        taxAmount = 500000 * 0.05 + 500000 * 0.1 + (salary - 1000000) * 0.15; // 15% สำหรับเงินเดือนมากกว่า 1,000,000
      }
      return taxAmount;
    }
  };
  