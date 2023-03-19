'use strict';

var Parser = class {
    constructor(statsString) {
      this.statsString = statsString;
    }
  
    getDistro() {
      const regex = /Linux distro:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      log(`statsString: ${this.statsString}`);
      return match ? match[1] : null;
    }
  
    getKernel() {
      const regex = /Linux kernel:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? match[1] : null;
    }
  
    getProcessor() {
      const regex = /Processor:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? match[1] : null;
    }
  
    getCores() {
      const regex = /Cores:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? parseInt(match[1]) : null;
    }
  
    getArchitecture() {
      const regex = /Architecture:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? match[1] : null;
    }
  
    getDriver() {
      const regex = /Driver:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? match[1] : null;
    }
  
    getCurrentStats() {
      const regex = /------------------------------ Current CPU stats ------------------------------\n((?:.*\n)+)------------------------------ CPU frequency scaling ----------------------------\n/;
      const match = regex.exec(this.statsString);
      if (!match) {
        return null;
      }
      const stats = match[1].trim().split('\n').map((line) => {
        const [core, usage, temp, freq] = line.trim().split(/\s+/);
        return { core, usage: parseFloat(usage), temp: parseInt(temp), freq: parseInt(freq) };
      });
      return stats;
    }
  
    getTotalCpuUsage() {
      const regex = /Total CPU usage:\s(.*) %\n/;
      const match = regex.exec(this.statsString);
      return match ? parseFloat(match[1]) : null;
    }
  
    getTotalSystemLoad() {
      const regex = /Total system load:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? parseFloat(match[1]) : null;
    }
  
    getAverageTemp() {
      const regex = /Average temp\. of all cores:\s(.*) °C\n/;
      const match = regex.exec(this.statsString);
      return match ? parseFloat(match[1]) : null;
    }
  
    getBatteryStatus() {
      const regex = /Battery is:\s(.*)\n/;
      const match = regex.exec(this.statsString);
      return match ? match[1] : null;
    }
  
    getGovernorSetting() {
      const regex = /Setting to use:\s"(.*)" governor\n/;
      const match = regex.exec(this.statsString);
      return match ? match[1] : null;
    }
  
    isTurboBoostEnabled() {
      const regex = /setting turbo boost:\s(.*)/;
      const match = regex.exec(this.statsString);
      return match ? match[1] === 'on' : null;
    }
}