import { container } from 'tsyringe';
import YupValidation from '../patterns/strategy/schemas/Yup';
import Context from '../patterns/strategy/schemas/Context';

const yupValidation = container.resolve(YupValidation);
const validationContext = new Context();

validationContext.setStrategy(yupValidation);
export default validationContext;
