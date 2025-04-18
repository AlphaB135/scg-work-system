
// socialSecurityAI.js
module.exports = {
    // ฟังก์ชันคำนวณประกันสังคม
    calculateSocialSecurity: function(salary) {
      const contributionRate = 0.05;  // อัตราค่าหัก 5%
      let contribution = salary * contributionRate;
      return contribution;
    },
  
    // ฟังก์ชันคำนวณประกันสังคมแบบแตกต่างตามระดับเงินเดือน
    calculateTieredSocialSecurity: function(salary) {
      let contribution = 0;
      if (salary <= 15000) {
        contribution = salary * 0.05; // 5% สำหรับเงินเดือนไม่เกิน 15,000 บาท
      } else if (salary <= 30000) {
        contribution = 15000 * 0.05 + (salary - 15000) * 0.07; // 7% สำหรับเงินเดือนระหว่าง 15,001 - 30,000 บาท
      } else {
        contribution = 15000 * 0.05 + 15000 * 0.07 + (salary - 30000) * 0.1; // 10% สำหรับเงินเดือนมากกว่า 30,000 บาท
      }
      return contribution;
    }
  };
  