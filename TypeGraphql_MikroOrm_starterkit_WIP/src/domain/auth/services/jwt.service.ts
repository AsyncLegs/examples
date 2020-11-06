import {Service} from "typedi";
import {JWK, JWT} from 'jose';
import {JwtPayloadDto} from "@domain/auth/dto/payloads/jwt.payload.dto";
import {readFileSync} from "fs";

@Service()
export class JwtService {
    private readonly privateKey = JWK.asKey(readFileSync(process.cwd() + '/keys/ecdsa-p521-private.pem'));
    public async sign(payload: JwtPayloadDto) {
        return JWT.sign(payload, this.privateKey, {
            algorithm: 'ES512',
            expiresIn: '1h'
        });
    }

    public verify(token?: string): JwtPayloadDto {
        if (token) {
            return JWT.verify(token, this.privateKey, {
                algorithms: ['ES512']
            });
        }
        throw new Error(`Invalid token`);
    }
}
