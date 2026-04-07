import { Controller, Get, Post } from '@nestjs/common';
import { ValidationService } from '../validation/validation.service';
import { AgentService } from './agent.service';
import { ValidationRecordDto } from '../validation/dto/validation.dto';
import { Logger } from '@nestjs/common';

/**
 * Demo Controller
 * Generates continuous demo data to showcase the entire system working together
 */
@Controller('demo')
export class DemoController {
  private readonly logger = new Logger(DemoController.name);
  private isRunning = false;
  private demoInterval: any;

  constructor(
    private readonly validationService: ValidationService,
    private readonly agentService: AgentService,
  ) {}

  /**
   * Start the demo - generates data continuously
   */
  @Post('start')
  startDemo() {
    if (this.isRunning) {
      return { message: '✅ Demo is already running', status: 'running' };
    }

    this.isRunning = true;
    this.logger.log('🎬 DEMO STARTED - Generating continuous data flow...');

    // Generate data every 3 seconds
    this.demoInterval = setInterval(() => {
      this.generateDemoData();
    }, 3000);

    return { 
      message: '🎬 Demo started! Generating data every 3 seconds...',
      status: 'started' 
    };
  }

  /**
   * Stop the demo
   */
  @Post('stop')
  stopDemo() {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
    }
    this.isRunning = false;
    this.logger.log('⏹️  DEMO STOPPED');
    return { message: '⏹️  Demo stopped', status: 'stopped' };
  }

  /**
   * Get demo status
   */
  @Get('status')
  getStatus() {
    return {
      isRunning: this.isRunning,
      status: this.isRunning ? '🟢 Running' : '⚫ Stopped',
    };
  }

  /**
   * Generate a single demo data point and process through entire pipeline
   */
  private generateDemoData() {
    const recordId = `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const validationData = this.createRandomValidationData();

    this.logger.log(`📊 Processing demo record: ${recordId}`);

    try {
      // Step 1: Validate the data
      const validationResult = this.validationService.validate(validationData);
      this.logger.log(`  ✓ Validation: ${validationResult.status}`);

      // Step 2: Agent decision based on validation
      const agentDecision = this.agentService.evaluateValidation(
        recordId,
        validationResult,
      );
      
      this.logger.log(
        `  ✓ Agent Decision: ${agentDecision.decision} | Confidence: ${agentDecision.confidence.toFixed(2)}% | Rules: ${agentDecision.rulesApplied.join(', ')}`,
      );

      return {
        recordId,
        validation: validationResult,
        agentDecision: agentDecision,
      };
    } catch (error) {
      this.logger.error('❌ Error in demo pipeline:', error);
    }
  }

  /**
   * Create random demo data matching ValidationRecordDto
   */
  private createRandomValidationData(): ValidationRecordDto {
    const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador', 'Fortaleza'];
    const produtos = ['Notebook', 'Monitor', 'Teclado', 'Mouse', 'Impressora', 'Scanner', 'Webcam', 'Headset'];
    const precos = [500, 750, 1200, 1800, 2500, 3500, 4200, 5000];
    const categorias = ['Eletrônicos', 'Periféricos', 'Acessórios'];

    const randomCidade = cidades[Math.floor(Math.random() * cidades.length)];
    const randomProduto = produtos[Math.floor(Math.random() * produtos.length)];
    const randomPrice = precos[Math.floor(Math.random() * precos.length)];
    const randomCategoria = categorias[Math.floor(Math.random() * categorias.length)];

    return {
      produto: randomProduto,
      categoria: randomCategoria,
      preco: randomPrice,
      cidade: randomCidade,
    };
  }
}

