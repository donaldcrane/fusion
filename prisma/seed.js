"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/models/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const password = "password";
const hashed = bcrypt_1.default.hashSync(password, 10);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield index_1.default.credit.deleteMany({});
        yield index_1.default.beneficiary.deleteMany({});
        yield index_1.default.debit.deleteMany({});
        yield index_1.default.users.deleteMany({});
        yield index_1.default.users.createMany({
            data: [
                {
                    id: "1d809e97-e26e-4597-aff3-070d6bf4599d",
                    name: "Donald Paul",
                    email: "donald@gmail.com",
                    password: hashed,
                    balance: 100000
                },
                {
                    id: "1857f7f4-a3e0-4bd4-b1f3-b98c045b4ed2",
                    name: "Peter Parker",
                    email: "donaldboy1@gmail.com",
                    password: hashed,
                    balance: 100000
                }
            ],
            skipDuplicates: true,
        });
        console.log("seeding completed........");
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.default.$disconnect();
}));
