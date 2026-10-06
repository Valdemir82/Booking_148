//Biblioteca e frameworks importados
import { expect, test } from 'playwright/test';

//Vavriáveis visíveis pelo arquivo todo
let bookingid;
//let token;


//equivalente ao Body
test.describe.serial('Testes do Booking', async () => {
    test('Realizar Login com Sucesso', async ({ request }) => {

        const user = {
            username: 'admin',
            password: 'password123',
        };

        // equivalente ao TRY/SEND
        const response = await request.post('https://restful-booker.herokuapp.com/auth',
            {
                data: user
            }

        );

        //Validação do statos code == 200
        expect(response.status()).toEqual(200);
        const responsebody = await response.json();
        expect(responsebody.token).toBeDefined();
        process.env.TOKEN = responsebody.token;
        console.log(`Token: ${process.env.TOKEN}`);
    }); // Fecha o bovo do teste de login

    //POST
    //Booking

    test('Realizar agendamento com sucesso', async ({ request }) => {
        console.log('Booking id do GET:' + bookingid);
        const booking = {
            firstname: 'Valdemir',
            lastname: 'White',
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-10-10',
                checkout: '2026-10-15',
            },
            additionalneeds: 'Breakfast, Dinner',
        };

        const response = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: booking
        })

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.booking.firstname).toEqual('Valdemir');
        expect(responseBody.booking.bookingdates.checkin).toEqual('2026-10-10');
        expect(responseBody.bookingid).toBeDefined(); // Valida se o campo bookingid existe/foi retornado
        bookingid = responseBody.bookingid; // Guarda o Bookingid na variavel externa
        console.log('Booking id NO FINAL do POST:' + bookingid);
    }); // Fecha o bloco de teste do POST do Booking

    //GET 
    test('Consultar agendamento com sucesso', async ({ request }) => {
        //Arrange -- PREPARA OS DADOS
        //const bookingid = 1475; vai vir uma variável de ambiente

        //act -- EXECUTA
        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingid}`)

        //assert -- VALIDA
        expect(response.status()).toEqual(200)
        const responseBody = await response.json()
        console.log(responseBody)
        expect(responseBody.firstname).toEqual('Valdemir')
        expect(responseBody.bookingdates.checkin).toEqual('2026-10-10')

    });

    // Fecha o bloco do teste do GET Booking

    test('Alterar o agendamento com sucesso', async ({ request }) => {

        //Arrange PREPARA
        const booking = {
            firstname: 'Valdemir',
            lastname: 'White',
            totalprice: 98,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-10-10',
                checkout: '2026-10-12',
            },
            additionalneeds: 'Breakfast',
        };

        // act ( agir/ação)
        const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingid}`,
            {
                headers: {
                    'Cookie': 'token=' + process.env.TOKEN,
                }, data: booking,
            },
        );

        //Assert
        expect(response.status()).toEqual(200)
        const responseBody = await response.json()
        console.log(responseBody)
        expect(responseBody.firstname).toEqual('Valdemir')
        expect(responseBody.totalprice).toEqual(98);
        expect(responseBody.bookingdates.checkin).toEqual('2026-10-10');
        expect(responseBody.bookingdates.checkout).toEqual('2026-10-12');
        expect(responseBody.additionalneeds).toEqual('Breakfast');


    });

    test('Alterar o agendamento parcial com sucesso', async ({ request }) => {
        //Arrange Preparar
        const booking = {
            lastname: 'Petrucci',
            depositpaid: false
        }

        //Act AÇÃO
        const response = await request.patch(
            `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            {
                headers: {
                    cookie: 'token=' + process.env.TOKEN
                }, data: booking
            },
        );

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.firstname).toEqual('Valdemir');
        expect(responseBody.lastname).toEqual('Petrucci');
        expect(responseBody.depositpaid).toEqual(false)
        expect(responseBody.totalprice).toEqual(98);;
        expect(responseBody.bookingdates.checkin).toEqual('2026-10-10');
        expect(responseBody.bookingdates.checkout).toEqual('2026-10-12');
        expect(responseBody.additionalneeds).toEqual('Breakfast');
    }) // fecha o tste PATCH

    test('Excluir/deletar agendamento com sucesso', async ({ request }) => {
        // Act AÇÃO
        const response = await request.delete(
            `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
                headers: {
                    cookie: 'token=' + process.env.TOKEN},
                }
            );

            //asset VLIDAÇÃO
            expect(response.status()).toEqual(201)
    }) // Fecha o test.describe.serial

 }); // Fecha o test.describe.serial
