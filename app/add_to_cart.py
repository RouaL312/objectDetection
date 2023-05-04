
from sqlalchemy import String


def cartdb(classids, boxes):
    from app import yolo
    from app.models import CartDB, Product, LigneCommande, CommandeVente
    from collections import Counter
    
    montant_total = 0
    montant_total_cmd = 0
    commandeVente = None  # Initialize the variable to a default value
    
    for i in range(len(classids)):
        area = boxes[i][2] * boxes[i][3]
        itemid = classids[i]
        print("class:" + str(classids[i]))
        print("area:" + str(area))
        if (area < 25000 and classids[i] == 3):
            itemid = itemid + 1000
        if (area < 4000 and classids[i] == 4):
            itemid = itemid + 1000
        print(itemid, area)
        product = Product.query.filter_by(code=str(itemid)).first()
        ligneCommande = LigneCommande(product.price, 1, str(itemid))
        montant_total = montant_total + (ligneCommande.montant_total * ligneCommande.quantite)
        ligneCommande.save()

    if (len(classids) > 0):
        # Query the LigneCommande table and order the results by itemid
        commande_vente_items = LigneCommande.query.order_by(LigneCommande.date_creation).all()
        # Print the results
        for item in commande_vente_items:
            montant_total_cmd = montant_total_cmd + item.montant_total
            commandeVente = CommandeVente(montant_total_cmd, item.id_ligne_cmd)
            commandeVente.save()
        print('----commande_vente_items----')
        print(commande_vente_items)

        # Make sure commandeVente has been assigned a value before returning it
        if commandeVente is not None:
            return commandeVente.id_commande_vente
    else:
        return ''