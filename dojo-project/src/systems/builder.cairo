#[starknet::interface]
trait IBuilder<TContractState> {
    fn create_team(self: @TContractState);
    fn add_piece_to_team(self: @TContractState, piece_id: u32, team_id: u32, x: u8, y: u8);
    fn remove_piece_from_team(self: @TContractState, piece_id: u32, team_id: u32);
    fn starter_team(self: @TContractState);
}

#[dojo::contract]
mod builder {

    use super::IBuilder;
    use starknet::{ContractAddress, get_caller_address};
    use project::models::player::{Player, PlayerTrait};
    use project::models::game::{Game, GameTrait, Vec2};
    use project::models::piece::{Piece, PieceTrait, PieceType};
    use project::models::team::{Team, TeamTrait, PiecesTrait, Pieces};
    use project::models::manager::{Manager, ManagerTrait};


    #[external(v0)]
    impl BuilderImpl of IBuilder<ContractState>{

        fn starter_team(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut player = get!(world, caller, (Player));
            let count = player.counts.team_count;

            assert(!(player.name ==''), 'player not created' );
            assert(count == 0, 'already claimed' );

            let mut team = TeamTrait::new(world.uuid(), caller);

            let type_id = get!(world, (0,4,0), (Manager)).id.try_into().unwrap();
            let stats = get!(world, type_id, (PieceType)).piece_stats;

            let tower = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);        
            let piece_one = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            let piece_two = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            let piece_three = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            let piece_four = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);
            let piece_five = PieceTrait::new(world.uuid(), caller, stats.hp, type_id);

            let mut team_pieces = PiecesTrait::new_from(tower.id, piece_one.id, piece_two.id, piece_three.id, piece_four.id, piece_five.id);
            
            self.add_pieces_to_team(ref team_pieces, team.id);
            //player.counts.pieces_count +=6;

            let manager = ManagerTrait::team(caller, count, team.id);

            //todo piece managers

            set!(world, (manager));


        }

        fn create_team(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();
            let mut player = get!(world, caller, (Player));
            assert(!(player.name ==''), 'player not created' );

            let count = player.counts.team_count;

            let team = TeamTrait::new(world.uuid(), caller);
            let manager = ManagerTrait::team(caller, count, team.id);
            
            player.counts.team_count +=1;
            
            set!(world, (player, team, manager));
        }

        fn add_piece_to_team(self: @ContractState, piece_id: u32, team_id: u32, x: u8, y: u8) {

            let world = self.world_dispatcher.read();
            let caller = get_caller_address().into();

            let mut piece = get!(world, piece_id, (Piece));
            assert(piece.data.owner == caller, 'not piece owner');
            assert(piece.available(), 'piece not available');
            //12x12 board, base is middle 6
            //1,2,3  || 4,5,6,7,8,9 || 10,11,12
            assert(x > 3 && x < 10, 'invalid x');
            assert(y >0 && y<3 , 'invalid y');


            let mut team = get!(world, team_id, (Team));
            assert(team.owner == caller, 'not team owner');
            team.add_piece(piece_id);
            piece.data.position = Vec2 {x: x.try_into().unwrap(), y: y.try_into().unwrap()};
            piece.data.location = team_id.into();

            set!(world, (team, piece));

        }

        fn remove_piece_from_team(self: @ContractState, piece_id: u32, team_id: u32){
            let world = self.world_dispatcher.read();

            let caller = get_caller_address().into();

            let mut team = get!(world, team_id, (Team));

            assert(team.owner == caller, 'not team owner');
            assert(team.contains(piece_id), 'piece not in team');
            //TODO: FIX
            //team.remove_piece(piece_id);

        }

        

        
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn add_pieces_to_team(self: @ContractState, ref pieces: Pieces, team_id: u32) {
            let world = self.world_dispatcher.read();

            let mut piece_ids = pieces.get_pieces();
            let mut index = 0;
            let piece_id = piece_ids.pop_front().unwrap();
            let mut team = get!(world, team_id, (Team));

            loop{
                let piece_id = piece_ids.pop_front().unwrap();
                if(piece_id == 0) {break;};

                let mut piece = get!(world, piece_id, (Piece));
                piece.add_to(team_id.into(), Vec2 {x:3+index, y:1});
                team.piece_count+=1;
                set!(world, (piece));

                index+=1;
            };

            set!(world, (team));

        }
    }

}
