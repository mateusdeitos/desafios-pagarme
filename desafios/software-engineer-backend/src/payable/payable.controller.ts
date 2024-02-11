import { Controller, Get } from '@nestjs/common';
import { PayableService } from './payable.service';
import { Payable } from './dtos';

@Controller('payable')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Get('balance')
  async getBalance() {
    const response = await this.payableService.getBalance();
    return response.reduce<Record<Payable['status'], Payable['amount']>>(
      (acc, curr) => {
        return {
          ...acc,
          [curr.status]: curr.amount,
        };
      },
      { paid: 0, waiting_funds: 0 },
    );
  }
}
