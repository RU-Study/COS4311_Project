import { CallCenter, Maintainer, MaintenanceHub, Restocker, RestockHub, SystemMonitor } from "./incident_hub";
import { VendingMachine } from "./vending_machine";


// + -------------------------------- Client ------------------------------- + //
const vendingMachine = new VendingMachine(100);

const e001 = new Restocker('E001');
const e002 = new CallCenter('E002');
const e003 = new CallCenter('E003');
const e004 = new SystemMonitor('E004');
const e005 = new Maintainer('E005');

e001.addResponsible(100);
e002.addResponsible(100);
e003.addResponsible(100);
e004.addResponsible(100);
e005.addResponsible(100);

const restockHub = RestockHub.getInstance();
const maintenanceHub = MaintenanceHub.getInstance();

restockHub.subscribe(e001);
restockHub.subscribe(e004);

maintenanceHub.subscribe(e002);
maintenanceHub.subscribe(e003);
maintenanceHub.subscribe(e004);
maintenanceHub.subscribe(e005);

(async () => {
  
  vendingMachine.showStock();
  vendingMachine.showMenu();
  
  await vendingMachine.orderMenu(5);

  console.log('\n ------------------------------------------------------------ \n')

  await vendingMachine.orderMenu(2);
  await vendingMachine.orderMenu(7);

  setTimeout(async () => {    
    console.log('\n -------------------------- Restock ------------------------- \n');
    vendingMachine.showMenu();
    e001.restock();
    vendingMachine.showStock();
    
    await vendingMachine.updateStock();
    
    vendingMachine.showMenu();
    vendingMachine.showStock();
    console.log('\n ------------------------------------------------------------ \n')

    console.log('\n ------------------------ Maintenance ----------------------- \n');
    await vendingMachine.orderMenu(9);
    
    setTimeout(() => {
      vendingMachine.showMenu();

      e005.maintenance();
      vendingMachine.updateStatus(true);

      vendingMachine.showMenu();

      console.log('\n ------------------------------------------------------------ \n')

      console.log('\n -------------------------- Refund ------------------------- \n');

      e002.showRecord();
      
      e003.refund(0);

      e002.showRecord();
      console.log('\n ------------------------------------------------------------ \n')
      
    }, 5100);


  }, 8000);
  

})();
