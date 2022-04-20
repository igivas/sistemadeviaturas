import { container } from 'tsyringe';
import JsonWebTokenEnsureAuthStrategy from '../patterns/strategy/middlewares/JsonWebTokenJWTStrategy';
import JWTContext from '../patterns/strategy/middlewares/JWTContext';

const jwtContext = container.resolve(JsonWebTokenEnsureAuthStrategy);

const ensureAuthenticatedContext = new JWTContext();
ensureAuthenticatedContext.setStrategy(jwtContext);

export default ensureAuthenticatedContext;
